/*
	jQuery's document.ready/$(function(){}) should
	you wish to use a cross-browser DOMReady solution
	without opting for a library.

	Demo: http://jsfiddle.net/8j85t/

	usage:
	$(function(){
		// your code
	});

	Parts: jQuery project, Diego Perini, Lucent M.
	This version: Addy Osmani, David Dallet
*/
(function (window) {
    "use strict";

    // Define a local copy of $
    var $ = function (callback) {
        registerOrRunCallback(callback);
        bindReady();
    },
		// Use the correct document accordingly with window argument (sandbox)
		document = window.document,
		readyBound = false,
		callbackQueue = [],
		registerOrRunCallback = function (callback) {
		    if (typeof callback === "function") {
		        callbackQueue.push(callback);
		    }
		},
		DOMReadyCallback = function () {
		    while (callbackQueue.length) {
		        (callbackQueue.shift())();
		    }
		    registerOrRunCallback = function (callback) {
		        callback();
		    };
		},

		// The ready event handler
		DOMContentLoaded = function () {
		    if (document.addEventListener) {
		        document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
		    } else {
		        // we're here because readyState !== "loading" in oldIE
		        // which is good enough for us to call the dom ready!
		        document.detachEvent("onreadystatechange", DOMContentLoaded);
		    }
		    DOMReady();
		},

		// Handle when the DOM is ready
		DOMReady = function () {
		    // Make sure that the DOM is not already loaded
		    if (!$.isReady) {
		        // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		        if (!document.body) {
		            return setTimeout(DOMReady, 1);
		        }
		        // Remember that the DOM is ready
		        $.isReady = true;
		        // If there are functions bound, to execute
		        DOMReadyCallback();
		        // Execute all of them
		    }
		}, // /ready()

		bindReady = function () {
		    var toplevel = false;

		    if (readyBound) {
		        return;
		    }
		    readyBound = true;

		    // Catch cases where $ is called after the
		    // browser event has already occurred.
		    if (document.readyState !== "loading") {
		        DOMReady();
		    }

		    // Mozilla, Opera and webkit nightlies currently support this event
		    if (document.addEventListener) {
		        // Use the handy event callback
		        document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
		        // A fallback to window.onload, that will always work
		        window.addEventListener("load", DOMContentLoaded, false);
		        // If IE event model is used
		    } else if (document.attachEvent) {
		        // ensure firing before onload,
		        // maybe late but safe also for iframes
		        document.attachEvent("onreadystatechange", DOMContentLoaded);
		        // A fallback to window.onload, that will always work
		        window.attachEvent("onload", DOMContentLoaded);
		        // If IE and not a frame
		        // continually check to see if the document is ready
		        try {
		            toplevel = window.frameElement == null;
		        } catch (e) { }
		        if (document.documentElement.doScroll && toplevel) {
		            doScrollCheck();
		        }
		    }
		},

		// The DOM ready check for Internet Explorer
		doScrollCheck = function () {
		    if ($.isReady) {
		        return;
		    }
		    try {
		        // If IE is used, use the trick by Diego Perini
		        // http://javascript.nwbox.com/IEContentLoaded/
		        document.documentElement.doScroll("left");
		    } catch (error) {
		        setTimeout(doScrollCheck, 1);
		        return;
		    }
		    // and execute any waiting functions
		    DOMReady();
		};

    // Is the DOM ready to be used? Set to true once it occurs.
    $.isReady = false;

    // Expose $ to the global object
    window.$ = $;

})(window);
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
    Array.isArray = function (vArg) {
        return Object.prototype.toString.call(vArg) === "[object Array]";
    };
}

if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf = function (find, i /*opt*/) {
        if (i === undefined) i = 0;
        if (i < 0) i += this.length;
        if (i < 0) i = 0;
        for (var n = this.length; i < n; i++)
            if (i in this && this[i] === find)
                return i;
        return -1;
    };
}

// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn, scope) {
        for (var i = 0, len = this.length; i < len; ++i) {
            fn.call(scope, this[i], i, this);
        }
    }
}
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
if (!Object.create) {
    Object.create = function (o) {
        if (arguments.length > 1) {
            throw new Error('Object.create implementation only accepts the first parameter.');
        }
        function F() { }
        F.prototype = o;
        return new F();
    };
}

// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
    Object.keys = (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
            if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) { throw new TypeError('Object.keys called on non-object'); }

            var result = [];

            for (var prop in obj) {
                if (hasOwnProperty.call(obj, prop)) { result.push(prop); }
            }

            if (hasDontEnumBug) {
                for (var i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) { result.push(dontEnums[i]); }
                }
            }

            return result;
        };
    })();
}
(function () {

    if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

    var prototype = Array.prototype,
        indexOf = prototype.indexOf,
        slice = prototype.slice,
        push = prototype.push,
        splice = prototype.splice,
        join = prototype.join;

    function DOMTokenList(el) {
        this._element = el;
        if (el.className != this._classCache) {
            this._classCache = el.className;

            if (!this._classCache) return;

            // The className needs to be trimmed and split on whitespace
            // to retrieve a list of classes.
            var classes = this._classCache.replace(/^\s+|\s+$/g, '').split(/\s+/),
              i;
            for (i = 0; i < classes.length; i++) {
                push.call(this, classes[i]);
            }
        }
    };

    function setToClassName(el, classes) {
        el.className = classes.join(' ');
    }

    DOMTokenList.prototype = {
        add: function (token) {
            if (this.contains(token)) return;
            push.call(this, token);
            setToClassName(this._element, slice.call(this, 0));
        },
        contains: function (token) {
            return indexOf.call(this, token) !== -1;
        },
        item: function (index) {
            return this[index] || null;
        },
        remove: function (token) {
            var i = indexOf.call(this, token);
            if (i === -1) {
                return;
            }
            splice.call(this, i, 1);
            setToClassName(this._element, slice.call(this, 0));
        },
        toString: function () {
            return join.call(this, ' ');
        },
        toggle: function (token) {
            if (!this.contains(token)) {
                this.add(token);
            } else {
                this.remove(token);
            }

            return this.contains(token);
        }
    };

    window.DOMTokenList = DOMTokenList;

    function defineElementGetter(obj, prop, getter) {
        if (Object.defineProperty) {
            Object.defineProperty(obj, prop, {
                get: getter
            })
        } else {
            obj.__defineGetter__(prop, getter);
        }
    }

    defineElementGetter(Element.prototype, 'classList', function () {
        return new DOMTokenList(this);
    });

})();
/* matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */

if (window.addEventListener) {

    window.matchMedia = window.matchMedia || (function (doc, undefined) {

        "use strict";

        var bool,
            docElem = doc.documentElement,
            refNode = docElem.firstElementChild || docElem.firstChild,
        // fakeBody required for <FF4 when executed in <head>
            fakeBody = doc.createElement("body"),
            div = doc.createElement("div");

        div.id = "mq-test-1";
        div.style.cssText = "position:absolute;top:-100em";
        fakeBody.style.background = "none";
        fakeBody.appendChild(div);

        return function (q) {

            div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

            docElem.insertBefore(fakeBody, refNode);
            bool = div.offsetWidth === 42;
            docElem.removeChild(fakeBody);

            return {
                matches: bool,
                media: q
            };

        };

    }(document));


    /* matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. Dual MIT/BSD license */
    (function () {
        // Bail out for browsers that have addListener support
        if (window.matchMedia && window.matchMedia('all').addListener) {
            return false;
        }

        var localMatchMedia = window.matchMedia,
            hasMediaQueries = localMatchMedia('only all').matches,
            isListening = false,
            timeoutID = 0,    // setTimeout for debouncing 'handleChange'
            queries = [],   // Contains each 'mql' and associated 'listeners' if 'addListener' is used
            handleChange = function (evt) {
                // Debounce
                clearTimeout(timeoutID);

                timeoutID = setTimeout(function () {
                    for (var i = 0, il = queries.length; i < il; i++) {
                        var mql = queries[i].mql,
                            listeners = queries[i].listeners || [],
                            matches = localMatchMedia(mql.media).matches;

                        // Update mql.matches value and call listeners
                        // Fire listeners only if transitioning to or from matched state
                        if (matches !== mql.matches) {
                            mql.matches = matches;

                            for (var j = 0, jl = listeners.length; j < jl; j++) {
                                listeners[j].call(window, mql);
                            }
                        }
                    }
                }, 30);
            };

        window.matchMedia = function (media) {
            var mql = localMatchMedia(media),
                listeners = [],
                index = 0;

            mql.addListener = function (listener) {
                // Changes would not occur to css media type so return now (Affects IE <= 8)
                if (!hasMediaQueries) {
                    return;
                }

                // Set up 'resize' listener for browsers that support CSS3 media queries (Not for IE <= 8)
                // There should only ever be 1 resize listener running for performance
                if (!isListening) {
                    isListening = true;
                    window.addEventListener('resize', handleChange, true);
                }

                // Push object only if it has not been pushed already
                if (index === 0) {
                    index = queries.push({
                        mql: mql,
                        listeners: listeners
                    });
                }

                listeners.push(listener);
            };

            mql.removeListener = function (listener) {
                for (var i = 0, il = listeners.length; i < il; i++) {
                    if (listeners[i] === listener) {
                        listeners.splice(i, 1);
                    }
                }
            };

            return mql;
        };
    }());

}
// addEventListener for IE8
// https://gist.github.com/jonathantneal/3748027
//
!window.addEventListener && (function (windowObject, WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
    WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener, fakeBool) {

        if (type == 'DOMContentLoaded' && contentLoaded) {
            contentLoaded(windowObject, listener);
            return;
        }

        var target = this;

        registry.unshift([target, type, listener, function (event) {
            event.currentTarget = target;
            event.preventDefault = function () { event.returnValue = false };
            event.stopPropagation = function () { event.cancelBubble = true };
            event.target = event.srcElement || target;

            if (listener.handleEvent) {
                listener.handleEvent.call(listener, event);
            } else if (listener.call) {
                listener.call(target, event);
            }
        }]);

        this.attachEvent("on" + type, registry[0][3]);
    };

    WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener, fakeBool) {
        for (var index = 0, register; register = registry[index]; ++index) {
            if (register[0] == this && register[1] == type && register[2] == listener) {
                return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
            }
        }
    };

    WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {

        return this.fireEvent("on" + eventObject.type, eventObject);
    };

})(window, Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () { },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}
String.prototype.hashCode = function () {
    var i, l, hash = 0;
    if (this.length == 0) return hash;
    l = this.length;
    for (i = 0; i < l; i++) {
        var chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

// Convert string to object reference

String.prototype.toObjectReference = function () {

    var levels, behaviour, depth, i;

    levels = this.split('.');
    depth = levels.length;
    behaviour = window;

    for (i = 0; i < depth; i++) {
        if (behaviour[levels[i]] === undefined) {
            return null;
        }
        behaviour = behaviour[levels[i]];
    }

    return behaviour;
};
var Namespace = {

    _cache: [],

    register: function (ns) {

        var i, levels, root;

        if (typeof (ns) === 'string') {

            // check if cached
            if (this._cache[ns]) {
                return this._cache[ns];
            }

            // build new ns object
            levels = ns.split('.');
            root = window;

            for (i = 0; levels[i] != undefined; i++) {
                if (typeof (root[levels[i]]) === 'undefined') {
                    root[levels[i]] = {};
                }
                root = root[levels[i]];
            }

            // store in cache
            this._cache[ns] = root;

            // return root element
            return root;
        }
        else {
            throw new Error('Namespace.register(ns) - ns should be in string format e.g. ("foo.bar")');
        }

        return null;
    }
};

Namespace.register('Observer');

Observer.subscribe = function (obj, type, fn) {

    if (!obj._listeners) {
        obj._listeners = [];
    }

    var test, i, l = obj._listeners;
    for (i = 0; i < l; i++) {
        test = obj._listeners[i];
        if (test.type === type && test.fn === fn) {
            return;
        }
    }

    obj._listeners.push({ 'type': type, 'fn': fn, 'capture': false });

};

Observer.remove = function (obj, type, fn) {

    if (!obj._listeners) {
        return;
    }

    var test;
    for (var i = obj._listeners.length - 1; i >= 0; i--) {
        test = obj._listeners[i];
        if (test.type === type && test.fn === fn) {
            obj._listeners.splice(i, 1);
            return;
        }
    }

};

Observer.publish = function (obj, type, data) {

    Observer._dispatch(obj, Observer.create(type), data);

};

Observer.create = function (type) {

    var myEvent = null;

    if (document.createEvent) {
        myEvent = document.createEvent('Events');
        myEvent.initEvent(type, true, true);
    }
    else if (document.createEventObject) {
        myEvent = document.createEventObject();
        myEvent.type = type;
    }

    return myEvent;
};

Observer._dispatch = function (obj, event, data) {

    if (!obj._listeners) {
        obj._listeners = [];
    }

    var test, i, l = obj._listeners.length;

    for (i = 0; i < l; i++) {

        test = obj._listeners[i];

        if (test && test.type === event.type) {

            if (typeof test.fn === 'function') {
                test.fn(data);
            }
            else if (test.fn.handleEvent) {
                test.fn.handleEvent(event, data);
            }

        }
    }

};
'use strict';

window.ddc = window.ddc || new Object('ddc');
ddc.element = {};
ddc.component = {};
ddc.api = {
    observer: new MutationObserver(function (mutations) {
        // Whether you iterate over mutations..
        mutations.forEach(function (mutation) {
            // or use all mutation records is entirely up to you
            var entry = {
                mutation: mutation,
                el: mutation.target,
                value: mutation.target.textContent,
                oldValue: mutation.oldValue
            };
            console.log('component changed:', entry);
        });
    })
};
ddc.debug = {};

'use strict';

ddc.api.getUrl = function (url) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', url);

        req.onload = function () {
            if (req.status == 200) {
                resolve(req.response);
            }

            else {
                reject(Error(req.statusText))
            }
        };

        req.onerror = function () {
            reject(Error("Network error"));
        };

        // make request
        req.send();
    });
}
'use strict';

ddc.component.Carousel = function (element) {
    that = this;
    // add active class for hiding elements
    element.classList.add('active');
    this.slides = document.querySelectorAll('.carousel--slide-list--slide');
    this.index = 0;
    this.announceSlide = true;
    this.addControls(element);
    this.addIndicators(element);
    this.setSlides(this.index);
    this.animate();
};

ddc.component.Carousel.prototype.addControls = function (element) {
    var ctrls = document.createElement('UL');
    ctrls.setAttribute('class', 'carousel--controls');

    ctrls.innerHTML = '<li>' +
    '<button type="button" class="carousel--btn-prev" aria-label="Previous">' +
    '</button>' +
  '</li>' +
  '<li>' +
    '<button type="button" class="carousel--btn-next" aria-label="Next">' +
    '</button>' +
  '</li>';

    ctrls.querySelector('.carousel--btn-next').addEventListener('click', function () {
        that.announceSlide = true;
        that.nextSlide();
    });

    ctrls.querySelector('.carousel--btn-prev').addEventListener('click', function () {
        that.announceSlide = true;
        that.prevSlide();
    });

    // add controls to carousel
    element.appendChild(ctrls);
};

ddc.component.Carousel.prototype.prevSlide = function () {
    var length = this.slides.length,
    	new_current = that.index - 1;

    if (new_current < 0) {
        new_current = length - 1;
    }

    this.setSlides(new_current);
};

ddc.component.Carousel.prototype.nextSlide = function () {
    var length = this.slides.length,
  			new_current = that.index + 1;

    if (new_current === length) {
        new_current = 0;
    }

    this.setSlides(new_current);
};

ddc.component.Carousel.prototype.setSlides = function (new_current, setFocus, args) {
    setFocus = typeof setFocusHere !== 'undefined' ? setFocusHere : false;
    that.slides[this.index].removeAttribute('aria-live');

    new_current = parseFloat(new_current);

    var length = this.slides.length,
    		new_next = new_current + 1,
    		new_prev = new_current - 1;

    if (new_next === length) {
        new_next = 0;
    } else if (new_prev < 0) {
        new_prev = length - 1;
    }

    for (var i = this.slides.length - 1; i >= 0; i--) {
        this.slides[i].classList.add('carousel--slide-list--slide');
    }

    that.slides[new_next].className = 'next carousel--slide-list--slide';
    that.slides[new_prev].className = 'prev carousel--slide-list--slide';

    that.slides[new_current].className = 'current carousel--slide-list--slide';

    if (this.announceSlide) {
        this.slides[new_current].setAttribute('aria-live', 'polite');
        that.announceSlide = false;
    }

    var buttons = document.querySelectorAll('.carousel--slidenav button');
    for (var i = buttons.length - 1; i >= 0; i--) {
        buttons[i].className = "";
    };
    buttons[new_current].className = "current";


    if (setFocus) {
        this.slides[new_current].setAttribute('tabindex', '-1');
        this.slides[new_current].focus();
    }

    this.index = new_current;
};

ddc.component.Carousel.prototype.addIndicators = function (element) {
    var indicators = document.createElement('UL');
    indicators.setAttribute('class', 'carousel--slidenav');

    that.forEach(this.slides, function (i, el) {
        var li = document.createElement('li'),
                klass = (i === 0) ? 'class="current"' : '',
                kurrent = (i === 0) ? ' <span class="visuallyhidden">(Current Slide)</span>' : '';

        li.innerHTML = '<button ' + klass + 'data-slide="' + i + '"><span class="visuallyhidden">News</span> ' + (i + 1) + kurrent + '</button>';
        indicators.appendChild(li);
    })

    indicators.addEventListener('click', function (event) {
        if (event.target.localName == 'button') {

            var el = document.querySelector('.current');
            el.className = "carousel--slide-list--slide";
            that.setSlides(event.target.getAttribute('data-slide'), true);
        }
    }, true);

    element.appendChild(indicators);
};

ddc.component.Carousel.prototype.forEach = function (array, callback, scope) {
    for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]); // passes back stuff we need
    }
};

ddc.component.Carousel.prototype.animate = function () {
    window.setInterval(function () {
        that.nextSlide();
    }, 8000);
};
'use strict';

ddc.api.store = {
    elm: []
};

ddc.component.GoogleMap = function (element) {
    var obj = {};

    if (element) {
        obj.id = element.getAttribute('id');
        obj.lat = Number(element.getAttribute('data-lat'));
        obj.lon = Number(element.getAttribute('data-lon'));
        obj.title = element.getAttribute('data-title');
        ddc.api.store.elm.push(obj);
    }

    if (typeof google === 'object' && typeof google.maps === 'object') {
        for (var i = 0; i < ddc.api.store.elm.length; i++) {
            map = new google.maps.Map(document.getElementById(ddc.api.store.elm[i].id), {
                center: { lat: ddc.api.store.elm[i].lat, lng: ddc.api.store.elm[i].lon },
                zoom: 17,
                mapTypeId: google.maps.MapTypeId.MAP,
                heading: 90,
                tilt: 45
            });
            marker = new google.maps.Marker({
                position: { lat: ddc.api.store.elm[i].lat, lng: ddc.api.store.elm[i].lon },
                map: map,
                title: ddc.api.store.elm[i].title
            });
        }
    }
};
'use strict';

ddc.component.Navigation = function (element) {

    var navEls = document.querySelectorAll('.main-navigation__first', element),
		length = navEls.length,
		mql = window.matchMedia('screen and (min-width: 40em)');

    if ('ontouchstart' in document.documentElement && mql.matches) {
        for (var i = 0; i < length; i++) {

            (function (index) {

                navEls[index].addEventListener('keydown', function (e) {
                    var keyCode = e ? (e.which ? e.which : e.keyCode) : event.keyCode,
                            el;
                    if (keyCode === 13) {
                        /* trigger the actual behavior we bound to the 'click' event */
                        el = document.querySelector('.show-sub');
                        if (el) {
                            el.classList.remove('show-sub');
                        }
                        e.target.click();
                    }
                });

                navEls[index].addEventListener('touchend', function (e) {

                    /* prevent delay and simulated mouse events */
                    e.preventDefault();
                    /* trigger the actual behavior we bound to the 'click' event */
                    e.target.click();
                });

                navEls[index].addEventListener('click', function () {
                    var el = document.querySelector('.show-sub');
                    if (el) {
                        el.classList.remove('show-sub');
                        this.classList.add('show-sub');
                    }
                    else {
                        this.classList.add('show-sub');
                    }
                });
            })(i);
        }

        document.addEventListener('click', function (e) {
            var el;
            if (e.target.className !== 'main-navigation__first show-sub') {
                el = document.querySelector('.show-sub');
                if (el) {
                    el.classList.remove('show-sub');
                }
            }
        });
    }
};
'use strict';

ddc.component.OffCanvas = function (element) {
    var toggleEl = document.querySelector('.toggle-nav'),
	toggleNav = function toggleNav() {
	    if (element) {
	        element.classList.toggle('show-nav');

	        if (toggleEl.innerHTML === 'Show menu') {
	            toggleEl.innerHTML = 'Hide menu';
	        }
	        else {
	            toggleEl.innerHTML = 'Show menu';
	        }
	    }
	};
    toggleEl.addEventListener('click', toggleNav, 'false');
};
'use strict';

ddc.initializeComponents = function () {
    var components = document.querySelectorAll('[data-constructor]'),
			len = components.length;
    for (var i = 0; i < len; i++) {
        var item = components[i],
				itemData = item.getAttribute('data-constructor');
        if (!item.getAttribute('data-instantiated')) {
            new ddc.component[itemData](item);
            item.setAttribute('data-instantiated', true);
        }
    }
};

$(function () {
    /* domready */
    ddc.initializeComponents();
});