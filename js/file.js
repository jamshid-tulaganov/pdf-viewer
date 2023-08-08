// declered input file
const inputFfile = document.getElementById('file');
const loader = document.getElementById('loader');
const labelFigure = document.getElementById('label-figure');
let file_to_base64 = null;

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
            getData();
        }
    };
    reader.readAsDataURL(file);

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

const getData = async () => {
    const pdfData = atob(file_to_base64)
 
console.log(pdfData);
// Using DocumentInitParameters object to load binary data.
var loadingTask = pdfjsLib.getDocument({data: pdfData});


loadingTask.promise.then(function(pdf) {
    console.log('PDF loaded');
    loader.style.display = "none";
	
	// Fetch the first page
	var pageNumber = 1;
	pdf.getPage(pageNumber).then(function(page) {
		console.log('Page loaded');
		
		var scale = 1.5;
		var viewport = page.getViewport({scale: scale});
		
		// Prepare canvas using PDF page dimensions
		var canvas = document.getElementById('the-canvas');
		var context = canvas.getContext('2d');
		canvas.height = viewport.height;
		canvas.width = viewport.width;
		
		// Render PDF page into canvas context
		var renderContext = {
			canvasContext: context,
			viewport: viewport
		};
		var renderTask = page.render(renderContext);
		renderTask.promise.then(function () {
			console.log('Page rendered');
		});
	});
}, function (reason) {
	// PDF loading error
	console.error(reason);
});
}