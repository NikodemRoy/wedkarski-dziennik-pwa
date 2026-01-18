function readFileAsDataUrl(file, cb) {
  const reader = new FileReader();
  reader.onload = function () {
    cb(String(reader.result || ""));
  };
  reader.onerror = function () {
    cb("");
  };
  reader.readAsDataURL(file);
}

function compressImageDataUrl(dataUrl, maxSize, quality, cb) {
  const img = new Image();

  img.onload = function () {
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;

    if (!w || !h) {
      cb("");
      return;
    }

    let scale = 1;
    if (w > h && w > maxSize) scale = maxSize / w;
    if (h >= w && h > maxSize) scale = maxSize / h;

    const nw = Math.max(1, Math.round(w * scale));
    const nh = Math.max(1, Math.round(h * scale));

    const canvas = document.createElement("canvas");
    canvas.width = nw;
    canvas.height = nh;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, nw, nh);

    let out = "";
    try {
      out = canvas.toDataURL("image/jpeg", quality);
    } catch (e) {
      out = "";
    }

    cb(out);
  };

  img.onerror = function () {
    cb("");
  };

  img.src = dataUrl;
}

function fileToCompressedDataUrl(file, maxSize, quality, cb) {
  readFileAsDataUrl(file, function (dataUrl) {
    if (!dataUrl || !String(dataUrl).startsWith("data:image/")) {
      cb("");
      return;
    }
    compressImageDataUrl(dataUrl, maxSize, quality, function (out) {
      cb(out);
    });
  });
}