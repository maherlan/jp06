if (undefined === HTMLElement.prototype.addClass) {
    Object.assign(HTMLElement.prototype, {
        addClass: function(className) {
            if (this.classList) {
                this.classList.add(className);
            }
            return this;
        },
        removeClass: function(className) {
            if (this.classList) {
                this.classList.remove(className);
            }
            return this;
        },
        toggleClass: function(className, toggle) {
            toggle ? this.addClass(className) : this.removeClass(className);
            return this;
        },
        hasClass: function(className) {
            if (this.classList) {
                return this.classList.contains(className);
            }
            return undefined;
        },
        show: function() {
            if (this.style) {
                this.style.display = "block";
            }
            return this;
        },
        hide: function() {
            if (this.style) {
                this.style.display = "none";
            }
            return this;
        },
        appendBefore: function (element) {
            this.parentElement && this.parentElement.insertBefore(element, this);
        },
        appendAfter: function (element) {
            this.parentElement && this.parentElement.insertBefore(element, this.nextSibling);
        },
        data: function(offset, value) {
            var attrName = 'data-' + offset;
            return undefined !== value
                ? this.setAttribute(attrName, value)
                : this.getAttribute(attrName);
        },
        hasData: function(offset) {
            return this.hasAttribute('data-' + offset);
        },
        removeData: function(offset) {
            return this.removeAttribute('data-' + offset);
        }
    });
}

// manage compatibility with previous browser
if (undefined === NodeList.prototype.forEach) {
    Object.assign(NodeList.prototype, {
        forEach: function(callback) {
            for (var index = 0; index < this.length; index++) {
                callback(this[index], index, this);
            }
        }
    });
}

if (undefined === String.hashCode) {
    String.prototype.hashCode = function() {
        var hash = 0, i = 0, len = this.length;
        while ( i < len ) {
            hash  = ((hash << 5) - hash + this.charCodeAt(i++)) << 0;
        }
        return hash;
    };
}

function getIdMep(_date) {
    var date = new Date(_date);
    var year = `${date.getFullYear()}`;
    var month = date.getMonth();
    var day = ('0' + date.getDate()).slice(-2);
    var years = 'abcdefghij';
    var months = ['j1', 'f1', 'm1', 'a1', 'm2', 'j2', 'j3', 'a2', 's1', 'o1', 'n1', 'd1'];
    return `${years[year[2]]}${year[3]}${months[month]}${day}`;
}

function initializeTracker() {
    pa.privacy.include.properties(['n:customer_code', 'customer_code', 'c_webdomain', 'c_hostname', 'c_idmp'], ['exempt'], ['page.display']);
}

function addTrackerProperties(_date) {
    pa.setProperties({
        'c_webdomain': document.location.host.replace(/^www\./, ''),
        'c_hostname' : document.location.host,
        'c_idmp': getIdMep(_date),
    },{
        'persistent': true
    });
}

window.addEventListener("load", function() {
    var ios = /iPad|iPhone|iPod|MacIntel/.test(navigator.platform);
    if (!ios) {
        return;
    }

    var backgrounds = Array.from(document.querySelectorAll('body [id^="wt-container-instance"]'))
        .filter(function(element) {
            return /^url\(/.test($(element).css('background-image'))
                && 'fixed' === $(element).css('background-attachment');
        });

    function handleIosDeviceByClass(x) {
        for (var i = 0; i < backgrounds.length; i++) {
            var classList = backgrounds[i].classList;
            if (x.matches) {
                !classList.contains('ios-enabled') && classList.add('ios-enabled');
            } else {
                classList.contains('ios-enabled') && classList.remove('ios-enabled');
            }
        }
    }

    var x = window.matchMedia("(max-width: 768px)");
    handleIosDeviceByClass(x, ios);
    x.addEventListener('change', handleIosDeviceByClass.bind(this, x));
});
