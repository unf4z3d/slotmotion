

/**
 * Format a number to disk unit size
 * @param {*} bytes 
 * @param {*} decimals 
 */
export function formatBytes(bytes,decimals) {
    if(bytes === 0) return '0 Bytes';
    var k = 1024,
        dm = decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
 }

 /**
  * 
  * @param {*} image 
  */
 export function imageUrl(image) {
    return `url(${image})`;
 }

 /**
  * Validate if one var is empty
  * @param {*} val 
  * @param {*} message 
  */
 export function isEmpty(val, message){
     if(val === undefined || val === null || val === ""){
        alert(message);
        return true;
     }
 }

 /**
  * Calculate pretty datetime like momment.js
  * @param {*} date 
  */
 export function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
        return Math.floor(seconds) + " seconds";
}