var pause = function(millis)
{
  var date = new Date();
  var curDate = null;
  do { curDate = new Date(); }
  while(curDate-date < millis);
}

module.exports = {
	pause: pause
};