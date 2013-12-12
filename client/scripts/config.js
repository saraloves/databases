//YOU DO NOT NEED TO EDIT this code. However, here's what's going on...
/*
  COOL STUFF TO KNOW ABOUT BELOW CODE:
  -The slashes and purple question marks are part of a 'RegEx', or 'Regular Expression'.
   RegEx's look for snippets of text inside a string. They look gross, but are crazy powerful. See links in the ReadMe for awesome tutorials.
  -'window.location' is a browser API that gives you access to the URL address bar. The .search property hands you back
   the text after a '?' character, which is often how searches look. (Search something on YouTube, and you'll see that).
  -So we're checking if the URL contains the username regex; if it doesn't, we prompt the user for a new one, and then
   set the search property of the URL to be whatever the user gave us.
*/

// var $ = require('./bower_components/jquery/jquery.min.js');

// if (!/(&|\?)username=/.test(window.location.search)) {
//   var newSearch = window.location.search;
//   if (newSearch !== '' & newSearch !== '?') {
//     newSearch += '&';
//   }
//   newSearch += 'username=' + ( prompt('What is your name?') || 'anonymous');
//   window.location.search = newSearch;
// }
// // Don't worry about this code, it will ensure that your ajax calls are allowed by the browser
// $.ajaxPrefilter(function (settings, _, jqXHR) {
//   jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
//   jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
// });
