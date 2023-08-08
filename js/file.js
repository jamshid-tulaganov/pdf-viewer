// declered input file
const inputFfile = document.getElementById('file');
const loader = document.getElementById('loader');
const labelFigure = document.getElementById('label-figure');
const downloadLInk = document.getElementById("download");
const buttons = document.getElementById("buttons");


let file_to_base64 = null;
let file_url = null;

// get file
inputFfile.addEventListener('change', (e) => {
    e.preventDefault();
    
    file = e.target.files[0];
    // 
    // / Encode the file using the FileReader API
    const reader = new FileReader();
    reader.onloadend = () => {
        // Use a regex to remove data url part
        file_to_base64 = reader.result
        .replace('data:', '')
        .replace(/^.+,/, '');
        
        
        if (file_to_base64) {
            getDocument(file_to_base64);
        }
    };
    reader.readAsDataURL(file);
    file_url = URL.createObjectURL(file);

    toggleStyle(); 
});

// toggle style
const toggleStyle = () => {
    loader.style.display = "block";
    labelFigure.style.display = "none";
};


// export default file_to_base64;

// he workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1,
    canvas = document.getElementById('the-canvas'),
    ctx = canvas.getContext('2d');

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage(num) {
  pageRendering = true;
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function(page) {
    var viewport = page.getViewport({scale: scale});
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);

    // Wait for rendering to finish
    renderTask.promise.then(function() {
      pageRendering = false;
      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  });

  // Update page counters
  document.getElementById('page_num').textContent = num;
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

/**
 * Displays previous page.
 */
function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}
document.getElementById('prev').addEventListener('click', onPrevPage);

/**
 * Displays next page.
 */
function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}
document.getElementById('next').addEventListener('click', onNextPage);

/**
 * Asynchronously downloads PDF.
 */

const getDocument = (pdfData) => {
    console.log(pdfData);
    pdfData = atob(pdfData);
    var loadingTask = pdfjsLib.getDocument({ data: pdfData });

    loadingTask.promise.then(function (pdfDoc_) {
        loader.style.display = "none";
        buttons.style.display = "block";
        downloadLInk.style.display = "block";
        pdfDoc = pdfDoc_;
        document.getElementById('page_count').textContent = pdfDoc.numPages;
        // Initial/first page rendering
        renderPage(pageNum);
    });
}


// download current pdf

downloadLInk.addEventListener('click', () => {
    downloadLInk.href = file_url;
})