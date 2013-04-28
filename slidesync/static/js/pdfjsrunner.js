function PdfJsRunner() {
    this.init = function(args) {
        this.url = args.file;
        this.pdfDoc = null;
        this.idx = this.getHashCursor() || 1;
        this.scale = 1;
        this.canvas = document.getElementById(args.canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvasWrapperLoc = args.canvasWrapperLoc;

        PDFJS.workerSrc = args.workerSrc;

        PDFJS.getDocument(this.url).then(function getPdf(_pdfDoc) {
            this.pdfDoc = _pdfDoc;
            this.renderPage(this.idx);
        }.bind(this));

        this.setupTouchEvents();
        window.onresize = this.onResize.bind(this);
        window.onhashchange= this.onHashChange.bind(this);
        window.onkeydown = this.onKeyDown.bind(this);
    }

    this.renderPage = function(num) {
        // Using promise to fetch the page
        this.pdfDoc.getPage(num).then(function(page) {
            var origViewport = page.getViewport(1);


            var sx = origViewport.width / $(this.canvasWrapperLoc).width(); //window.innerWidth;
            // Subtract height of top navbar
            var sy = origViewport.height / ($(window).height() - parseInt($('body').css('padding-top'))); //window.innerHeight;
            this.scale = (1/Math.max(sx, sy));

            var viewport = page.getViewport(this.scale);
            this.canvas.height = viewport.height;
            this.canvas.width = viewport.width;

            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: this.ctx,
                viewport: viewport
            };
            page.render(renderContext);
        }.bind(this));
    }

    this.setPage = function(newPage) {
        this.updateHash(newPage);
    }

    this.back = function() {
        if (this.idx <= 1) {
            return;
        }
        this.setPage(this.idx-1);
    }

    this.forward = function() {
        if (this.idx >= this.pdfDoc.numPages) {
            return;
        }
        this.setPage(this.idx+1);
    }

    this.updateHash = function(str) {
        if (window.history.replaceState) {
            window.history.replaceState({}, "", "#" + str);
            $(window).trigger('hashchange');
        }
        else {
            window.location.hash = "#" + str;
        }
    }

    this.onHashChange = function() {
        var cursor = this.getHashCursor();
        var newPage = 1;
        if (cursor) {
            newPage = cursor;
        }
        if (newPage >= 1 && newPage <= this.pdfDoc.numPages) {
            this.idx = newPage;
            this.renderPage(this.idx);
        }
    }

    this.getHashCursor = function() {
        return parseInt(window.location.hash.split("#")[1]);
    }

    this.onResize = function(aEvent) {
        this.renderPage(this.idx);
    }

    this.setupTouchEvents = function() {
        var orgX, newX;
        var tracking = false;

        var db = this.canvas;
        db.addEventListener("touchstart", start.bind(this), false);
        db.addEventListener("touchmove", move.bind(this), false);

        function start(aEvent) {
            aEvent.preventDefault();
            tracking = true;
            orgX = aEvent.changedTouches[0].pageX;
        }

        function move(aEvent) {
            if (!tracking) return;
            newX = aEvent.changedTouches[0].pageX;
            if (orgX - newX > 100) {
                tracking = false;
                this.forward();
            } else {
                if (orgX - newX < -100) {
                    tracking = false;
                    this.back();
                }
            }
        }
    }

    // Allow for keyboard events for navigation.
    this.onKeyDown = function(aEvent) {
        // Don't intercept keyboard shortcuts
        if (aEvent.altKey
            || aEvent.ctrlKey
            || aEvent.metaKey
            || aEvent.shiftKey) {
            return;
        }

        if (aEvent.keyCode == 37 // left arrow
            || aEvent.keyCode == 38 // up arrow
            || aEvent.keyCode == 33 // page up
        ) {
            aEvent.preventDefault();
            this.back();
        }
        if (aEvent.keyCode == 39 // right arrow
            || aEvent.keyCode == 40 // down arrow
            || aEvent.keyCode == 34 // page down
        ) {
            aEvent.preventDefault();
            this.forward();
        }
    }

    this.bindToSocket = function(socket) {
        this.socket = socket;

        this.socket.on('receive', function(data) {
            this.setPage(data);
        }.bind(this));
    }
};

function PdfJsPresenter() { 
    this.setPage = function(newPage) {
        if(this.socket) {
            this.socket.emit('send', newPage);
            console.log('sent ' + newPage);
        }
        PdfJsPresenter.prototype.setPage(newPage);
    }
}
PdfJsPresenter.prototype = new PdfJsRunner();