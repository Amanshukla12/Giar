const params = new URLSearchParams(window.location.search);
document.getElementById("planTitle").innerText = decodeURIComponent(params.get("plan") || "No Plan Selected");
document.getElementById("fees").innerHTML = `<strong>Fees:</strong> ${decodeURIComponent(params.get("fees") || '')}`;
document.getElementById("benefit").innerHTML = `<strong>Benefit:</strong> ${decodeURIComponent(params.get("benefit") || '')}`;