const myImage = document.querySelector("#my_image");
const originalImageContainer = document.querySelector("#original_image_container");
const compressedImageContainer = document.querySelector("#compressed_image_container");
const originalText = document.querySelector("#original_text");
const compressedText = document.querySelector("#compressed_text");
const originalSize = document.querySelector("#original_size");
const compressedSize = document.querySelector("#compressed_size");
const compressionPercentage = document.querySelector("#compression_percentage");
const downloadButton = document.querySelector("#download_button"); // New download button
const chooseFileButton = document.querySelector("#choose_file_button");
const fileName = document.querySelector("#file_name");

let compressedImageUrl = ''; // Variable to store compressed image URL

chooseFileButton.addEventListener("click", () => {
    myImage.click();
});

myImage.addEventListener("change", (evt) => {
    const image = evt.target.files[0];

    if (!image) return;

    fileName.textContent = image.name;

    const reader = new FileReader();

    originalImageContainer.innerHTML = ''; // Clear previous content
    compressedImageContainer.innerHTML = ''; // Clear previous content
    compressedText.textContent = "Compressed Image"; // Set initial text for compressed image
    originalSize.textContent = ''; // Clear original size
    compressedSize.textContent = ''; // Clear compressed size
    compressionPercentage.textContent = ''; // Clear compression percentage
    downloadButton.style.display = "none"; // Hide the download button initially

    // Get original image size in MB
    const originalFileSizeMB = (image.size / (1024 * 1024)).toFixed(2); // Size in MB

    reader.onload = () => {
        const newImage = new Image();
        newImage.src = reader.result;
        newImage.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.height = newImage.height;
            canvas.width = newImage.width;
            const ctx = canvas.getContext('2d');

            // Display the original image
            originalImageContainer.appendChild(newImage);
            originalText.style.display = 'block'; // Show the "Original Image" text
            originalSize.textContent = `Original Size: ${originalFileSizeMB} MB`; // Display original image size

            // Draw the image on the canvas
            ctx.drawImage(newImage, 0, 0);

            // Compress the image (adjust quality as needed)
            const newUrl = canvas.toDataURL('image/jpeg', 0.5);

            // Calculate the size of the compressed image (base64 string size estimate)
            const compressedSizeBytes = (newUrl.length * (3 / 4)) - 2; // Base64 length to bytes
            const compressedFileSizeMB = (compressedSizeBytes / (1024 * 1024)).toFixed(2); // Size in MB

            // Display the compressed image with the same width and height as the original image
            compressedImageContainer.innerHTML = `<img src="${newUrl}" width="${newImage.width}" height="${newImage.height}" alt="Compressed Image">`;
            
            // Set the compressed image URL
            compressedImageUrl = newUrl;

            // Update the compressed image text to include the download instruction
            compressedText.textContent = "Compressed Image (Click to download)";

            // Display compressed image size
            compressedSize.textContent = `Compressed Size: ${compressedFileSizeMB} MB`;

            // Calculate compression percentage
            const compressionRatio = ((image.size - compressedSizeBytes) / image.size) * 100;
            compressionPercentage.textContent = `Compressed by: ${compressionRatio.toFixed(2)}%`;

            // Show the download button
            downloadButton.style.display = "block";
        };
    };
    reader.readAsDataURL(image);
});

// Functionality for the download button
downloadButton.addEventListener("click", () => {
    const a = document.createElement('a');
    a.download = 'compressed_image.jpeg';
    a.href = compressedImageUrl;
    a.target = '_blank';
    a.click();
});