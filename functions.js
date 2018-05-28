var functions = {

    fs: require('fs'),

    ucFirst: function(string)
    {

        return string.charAt(0).toUpperCase() + string.slice(1);

    },

    getTimestamp: function()
    {
        return new Date().getTime() / 1000;
    },

    getKey: function(obj){

        for (var prop in obj)
            return prop;

    },

    getDateTime: function(time)
    {

        var date, hours, minut, month, sec, year;

        if (!time) {
            time = new Date();
        }
        year = time.getFullYear();
        month = time.getMonth();
        month++;
        month = month.toString();
        if (month.length === 1) {
            month = '0' + month;
        }
        date = time.getDate().toString();
        if (date.length === 1) {
            date = '0' + date;
        }
        hours = time.getHours().toString();
        if (hours.length === 1) {
            hours = '0' + hours;
        }
        minut = time.getMinutes().toString();
        if (minut.length === 1) {
            minut = '0' + minut;
        }
        sec = time.getSeconds().toString();
        if (sec.length === 1) {
            sec = '0' + sec;
        }
        return year.toString() + '-' + month + '-' + date + ' ' + hours + ':' + minut + ':' + sec;

    },

    debounce: function(fn, time){
        let timeout;

        return function() {
            const functionCall = () => fn.apply(this, arguments);

            clearTimeout(timeout);
            timeout = setTimeout(functionCall, time);
        }
    }

}

module.exports = functions;