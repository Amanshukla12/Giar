function togglePlan(planType, planDuration) {
    let lifetimeDetails = document.getElementById(planType + '-lifetime-details');
    let annualDetails = document.getElementById(planType + '-annual-details');
    let purchaseButton = document.getElementById(planType + '-purchase');

    if (planDuration === 'lifetime') {
        lifetimeDetails.style.display = 'block';
        annualDetails.style.display = 'none';
    } else if (planDuration === 'annual') {
        lifetimeDetails.style.display = 'none';
        annualDetails.style.display = 'block';
    }

    purchaseButton.style.display = 'block';
}

function redirectToPurchase(planType) {
    window.location.href = 'membership2.html?plan=' + planType;
}