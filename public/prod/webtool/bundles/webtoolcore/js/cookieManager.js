if (!window.CookieManager) {
    window.CookieManager = {
        setCookie: function(cookieName, value, expiredAfter) {
            var expiryDate = new Date();
            if (undefined === expiredAfter) {
                expiredAfter = '3M';
            }
            if (expiredAfter) {
                var matches = expiredAfter.match(/^(\d+)([yMdhms])$/);
                if (!matches) {
                    matches = ['3M', 3, 'M'];
                }
                var unit = {
                    y: 'FullYear',
                    M: 'Month',
                    d: 'Date',
                    h: 'Hours',
                    m: 'Minutes',
                    s: 'Seconds'
                }[matches[2]];
                expiryDate['set' + unit](expiryDate['get' + unit]() + parseInt(matches[1]));
            }
            document.cookie = cookieName + "=" + value + ";path=/;expires=" + expiryDate.toGMTString();
        },
        getCookies: function() {
            var cookiesList = document.cookie.split(";");
            var cookies = {};
            if (!cookiesList.length) {
                return cookies;
            }

            cookiesList.forEach(function(cookie) {
                if (!cookie) {
                    return;
                }
                var [cookieName, cookieValue] = cookie.trim().split("=");
                switch (true) {
                    case /^\d+$/.test(cookieValue):
                        cookieValue = parseInt(cookieValue);
                        break;
                    case /^(true|false)$/i.test(cookieValue):
                        cookieValue = JSON.parse(cookieValue);
                        break;
                    case '' === cookieValue:
                        cookieValue = null;
                        break;
                }
                cookies[cookieName] = cookieValue;
            });

            return cookies;
        },
        getCookie: function(cookieName) {
            return this.getCookies()[cookieName];
        }
    }
}
