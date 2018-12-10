// Google Login
function onLoadFunction() {
    gapi.client.setApiKey('AIzaSyACSZmgdWhNZDAFh6D5fonm09VvilkH4uo');
    gapi.client.load('plus', 'v1', function () {});
    onLoadCallback();
}