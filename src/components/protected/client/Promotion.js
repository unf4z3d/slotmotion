import React from 'react';
import { Paper, Chip, FlatButton } from 'material-ui';
import FileCloudUpload from 'material-ui/svg-icons/file/cloud-upload';
import ClientRoleAwareComponent from './ClientRoleAwareComponent';
import Countdown from 'react-countdown-now';
import { firabaseDB, constants } from './../../../config/constants';
import dateFormat from 'dateformat';
import { imageUrl, timeSince } from './../../../helpers/index';
import { callGetUserGameplay } from './../../../helpers/api';

/**
 * Promotion component for client Role.
 */
class Promotion extends ClientRoleAwareComponent {
  /**
   * Component constructor
   * @param {*} props
   */
  constructor(props) {
    super(props);

    if (props.value.levels === undefined) {
      props.value.levels = [{}, {}, {}, {}, {}];
    }

    this.state = {
      promotion: props.value,
      loadingLevelProgress: false,
      selectedLevelIndex: null,
      selectedLevel: {},
      showDetail: 'none'
    };
    this.signupsDB = firabaseDB.child(`users/${this.getUser().uid}/signups`);
    this.promotionsStatusDB = firabaseDB.child('promotion_status');
  }

  /**
   * Component Life Cycle
   */
  componentWillMount() {
    const { promotion } = this.state;
    if (promotion.key !== undefined) {
      this.signupsDB.child(promotion.key).on('value', snap => {
        const signedUp = snap.val();
        if (signedUp !== null) {
          promotion.createdAt = signedUp.createdAt;
          promotion.createdAtTime = signedUp.createdAtTime;
          this.promotionsStatusDB.child(signedUp.status).once('value', snap => {
            promotion.status = snap.val();
            promotion.status.id = signedUp.status;
            this.setState({ promotion });
            if (this.getUser().profile.apiId !== undefined) {
              this.refreshLevelStatus();
            }
          });
        }
      });
    }
  }

  /**
   * Component Life Cycle
   */
  componentWillUnmount() {
    this.signupsDB.off();
    this.promotionsStatusDB.off();
  }

  /**
   * Refresh the current status of reached levels.
   */
  refreshLevelStatus = () => {
    const { status } = this.state.promotion;
    let { promotion } = this.state;

    if (status !== undefined) {
      if (status.id === 2 || status.id === 3) {
        this.setState({ loadingLevelProgress: true });
        const signupDate = dateFormat(promotion.createdAtTime, 'isoUtcDateTime', true);
        callGetUserGameplay(this.getUser(), signupDate)
        .then(response => {
          const totalBet = response.data.totalBet;

          let completed = true;
          promotion.levels.forEach(level => {
            if (totalBet >= level.bestToReach) level.reached = true;
            else {
              level.reached = false;
              completed = false;
            }
          });

          if (completed) {
            const completed = constants.promotionsStatus.completed;

            this.promotionsStatusDB.child(completed)
            .once('value', snap => {
              promotion.status = snap.val();
              promotion.status.id = completed;

              firabaseDB
                .child('users')
                .child(this.getUser().uid)
                .child('signups')
                .child(promotion.key)
                .update({ status: completed });
            });
          }

          this.setState({ promotion, loadingLevelProgress: false });
        })
        .catch(error => {
          this.setState({ loading: false, loadingLevelProgress: false });
        });
      } else if (status.id === 8) {
        promotion.levels.forEach(l => l.reached = true);
        this.setState({ promotion, loadingLevelProgress: false });
      }
    }
  };

  /**
   * @TODO DELETE THIS
   * Get the level image by the index.
   */
  getImageLevel = index => {
    let image = undefined;
    const reached = this.state.promotion.levels[index].reached;

    if (reached !== undefined && reached) {
      image = this.state.promotion.levels[index].activeImage.previewImage;
    } else {
      image = this.state.promotion.levels[index].inactiveImage.previewImage;
    }

    if (image === '') {
      image = undefined;
    }

    return image;
  };

  /**
   * Is allowed to signup this campaign o promotion.
   */
  isSingupAllowed = () => {
    return this.props.signupAllowed !== undefined && this.props.signupAllowed;
  };

  /**
   * User signup in the campaign.
   */
  signUpCampaign = () => {
    this.saveUserSignup();
  };

  /**
   * Save the campaign in the current user.
   */
  saveUserSignup() {
    const { promotion } = this.state;
    const now = new Date();
    const userSignup = {
      status: 0,
      createdAtTime: now.getTime(),
      createdAt: dateFormat(now, constants.formatDate)
    };

    firabaseDB
      .child('users')
      .child(this.getUser().uid)
      .child('signups')
      .child(promotion.key)
      .set(userSignup)
      .then(snap => {
        userSignup.promotion = promotion.key;
        userSignup.user = this.getUser().uid;
        this.saveCampaignSignup(userSignup);
      });
  }

  /**
   * Save the user-campaign relation.
   */
  saveCampaignSignup = userSignup => {
    firabaseDB
      .child('signups')
      .push(userSignup)
      .then(snap => {
        this.showSuccessMessage('Signup Successful');
        if (this.props.signupCallback !== undefined) {
          this.props.signupCallback();
        }
      });
  };

  /**
   * Show the clock in the promotion
   */
  started = () => {
    return this.state.promotion.startDateTime > Date.now();
  };

  /**
   * Render the promotion like a countdown clock
   */
  renderClock = ({ days, hours, minutes, seconds, completed }) => {
    const times = [
      days < 10 ? '0' + days : days,
      hours < 10 ? '0' + hours : hours,
      minutes < 10 ? '0' + minutes : minutes,
      seconds < 10 ? '0' + seconds : seconds,
      'Watch Demo'
    ];

    return (
      <div>
        {[...Array(5)].map((x, i) => (
          <Paper
            key={i}
            onClick={
              i === 4 &&
              (() => {
                this.handleWathDemo('https://youtu.be/M7lc1UVf-VE');
              })
            }
            className={i === 4 ? 'promo-level watch-demo' : 'promo-level clock'}
            zDepth={1}
            circle={true}
          >
            <span className="promo-edit-level">{times[i]}</span>
          </Paper>
        ))}
      </div>
    );
  };

  /**
   * Render the video player
   */
  handleWathDemo = url => {
    this.props.onWathDemo(url);
  };

  renderLevelStatus = i => {
    const status = 'undefined';
    return (
      <Chip key={i} className={'st-lvl st-lvl-' + i}>
        {status}
      </Chip>
    );
  };

  renderPromotionStatus = () => {
    let status = null;
    if (this.state.promotion.status) {
      status = this.state.promotion.status.description;
    }

    return <Chip className={status !== null ? 'st-lvl st-lvl-4 visible ' + status : 'st-lvl st-lvl-4'}>{status}</Chip>;
  };

  getLogoImage = () => {
    return imageUrl(this.state.promotion.logoPreviewImage);
  };

  getPromotionBG = promotion => {
    let promotionBG = '';
    promotion.levels.forEach((level, i) => {
      if (level.reached) promotionBG = 'promotion-bg-lvl-' + i;
    });
    return `promotion-steps ${promotionBG}`;
  };

  handleToggleShowDetail = () => {
    this.setState({
      showDetail: this.state.showDetail === 'block' ? 'none' : 'block'
    });
  };

  /**
   * Render method
   */
  render() {
    const jsx = (
      <div className="promotion">
        <div className="panel">
          <div className="row">
            <div className="col-4">
              <div className="panel-header-image">
                {this.state.promotion.logoPreviewImage === undefined ? (
                  <div className="text-left">
                    <FlatButton
                      labelPosition="after"
                      icon={<FileCloudUpload />}
                      className="btn-smotion link"
                      containerElement="label"
                      label="Upload Logo Picture"
                    >
                      <input onChange={this.chooseLogoPicture} style={{ display: 'none' }} type="file" />
                    </FlatButton>
                  </div>
                ) : (
                  <Paper
                    onClick={this.handleToggleShowDetail}
                    className="promo-logo"
                    style={{ backgroundImage: this.getLogoImage() }}
                    zDepth={1}
                  />
                )}
              </div>
            </div>
            <div className="col-8">
              <div className="panel-header-label">
                <div>
                  {this.started() ? (
                    <div>Releasing in:</div>
                  ) : (
                    <div>
                      Started {timeSince(this.state.promotion.startDateTime)} ago &nbsp;&#8226;&nbsp; Ends{' '}
                      {this.state.promotion.endDate}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              {this.started() ? (
                <div className="promotion-steps clock">
                  <Countdown
                    date={this.state.promotion.startDateTime}
                    onComplete={() => window.location.reload()}
                    renderer={this.renderClock}
                  />
                </div>
              ) : (
                <div className={this.getPromotionBG(this.state.promotion)}>
                  {[...Array(5)].map(
                    (x, i) =>
                      this.isSingupAllowed() && i === 4 ? (
                        <Paper key={i} className="promo-level signup app-tooltip" zDepth={1} circle={true}>
                          <span onClick={() => this.signUpCampaign()} className="promo-edit-level">
                            SIGNUP
                          </span>
                          <span className="app-tooltip-content promotion-tooltip-container">
                            <div className="promotion-tooltip">
                              <label>For you:</label>
                              <br />
                              <span>{this.state.promotion.levels[i].discount}% Discount</span>
                              <hr />
                              <label>For your players:</label>
                              <br />
                              <span>{this.state.promotion.levels[i].freearounds} Freerounds</span>
                            </div>
                          </span>
                        </Paper>
                      ) : (
                        <Paper key={i} className="promo-level app-tooltip" zDepth={1} circle={true}>
                          <span className="promo-edit-level">
                            <img src={this.getImageLevel(i)} alt="" />
                          </span>
                          <span className="app-tooltip-content promotion-tooltip-container">
                            <div className="promotion-tooltip">
                              <label>For you:</label>
                              <br />
                              <span>{this.state.promotion.levels[i].discount}% Discount</span>
                              <hr />
                              <label>For your players:</label>
                              <br />
                              <span>{this.state.promotion.levels[i].freearounds} Freerounds</span>
                            </div>
                          </span>
                        </Paper>
                      )
                  )}
                </div>
              )}
              {this.state.loadingLevelProgress && (
                <div className="loading-level-progress">Loading progress, please wait.</div>
              )}
            </div>
          </div>
          <div className="promotion-detail" style={{ display: this.state.showDetail }}>
            <div className="row">
              <div className="col-8">
                <span className="promotion-name">
                  <div className="transparent-input">{this.state.promotion.name}</div>
                </span>
                {(this.state.promotion.startDate || this.state.promotion.endDate) && (
                  <div className="promotion-calendars">
                    <div>
                      Started {timeSince(this.state.promotion.startDateTime)} ago &nbsp;&#8226;&nbsp; Ends{' '}
                      {this.state.promotion.endDate}
                    </div>
                  </div>
                )}
              </div>
              <div className="col-4">
                <div className="promotion-download-package">
                  <Chip style={{ margin: 4 }}>
                    <a target="_new" href={this.state.promotion.campaignPackageURL}>
                      Download Campaign Package
                    </a>
                  </Chip>
                </div>
              </div>
            </div>
          </div>
          <div className="promotion-detail description" style={{ display: this.state.showDetail }}>
            <div className="row">
              <div className="col-12">
                <div className="transparent-input fullwidth" style={{ height: 'auto', resize: 'none' }}>
                  {this.state.promotion.description}
                </div>
              </div>
            </div>
          </div>
          {this.started() === false && (
            <div className="row">
              <div className="col-12">
                <div className="promotion-status">
                  {[...Array(4)].map((x, i) => this.renderLevelStatus(i))}
                  {this.renderPromotionStatus()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );

    return jsx;
  }
}

// export the component
export default Promotion;
