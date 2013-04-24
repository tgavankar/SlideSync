function PdfJsRunner() {
    this.init = function(args) {
        this.url = args.file;
        this.pdfDoc = null;
        this.idx = 1;
        this.scale = 1;
        this.canvas = document.getElementById('the-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvasWrapperLoc = args.canvasWrapperLoc;

        PDFJS.workerSrc = args.workerSrc;

        PDFJS.getDocument(this.url).then(function getPdf(_pdfDoc) {
            this.pdfDoc = _pdfDoc;
            this.renderPage(this.idx);
        }.bind(this));

        window.onresize = this.onResize.bind(this);
        window.onhashchange= this.onHashChange.bind(this);
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
        this.setPage(this.idx-1);
    }

    this.forward = function() {
        this.setPage(this.idx+1);
    }

    this.updateHash = function(str) {
        if(window.history.replaceState) {
            window.history.replaceState({}, "", "#" + str);
            $(window).trigger('hashchange');
        }
        else {
            window.location.hash = "#" + str;
        }
    }

    this.onHashChange = function() {
        var cursor = window.location.hash.split("#")[1];
        var newPage = 1;
        if(cursor) {
            newPage = parseInt(cursor);
        }
        if(newPage >= 1 && newPage <= this.pdfDoc.numPages) {
            this.idx = newPage;
            this.renderPage(this.idx);
        }
    }

    this.onResize = function(aEvent) {
        this.renderPage(this.idx);
    }

};




  /*************/

    

    function goFullscreen(id) {
        // fire event to resize PDF canvas
        var element = document.getElementById(id);


        if(document.fullScreen) {
            document.cancelFullScreen();
            return false;
        } else if(document.mozFullScreen) {
            document.mozCancelFullScreen();
            return false;
        } else if(document.webkitIsFullScreen) {
            document.webkitCancelFullScreen();
            return false;
        }


        if(element.RequestFullScreen) {
            element.RequestFullScreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    }

