// script.js file ka content
const BACKEND_URL = 'https://bhada-calculator-api.onrender.com/calculate_bhada';
// !!! NOTE: Yah abhi local URL hai. Isko hum Render Deployment ke baad change karenge !!!

document.getElementById('calculate-btn').addEventListener('click', calculateBhada);
document.getElementById('toggle-manual').addEventListener('click', toggleManualInputs);

function toggleManualInputs(e) {
    e.preventDefault(); 
    const manualDiv = document.getElementById('manual-inputs');
    if (manualDiv.style.display === 'none') {
        manualDiv.style.display = 'block';
        e.target.textContent = 'Hide Advanced Settings';
    } else {
        manualDiv.style.display = 'none';
        e.target.textContent = 'Advanced Settings / Manual Edit (Pro)';
    }
}

async function calculateBhada() {
    const btn = document.getElementById('calculate-btn');
    btn.textContent = 'Calculating...';
    btn.disabled = true;

    // Frontend se saare inputs collect karna
    const data = {
        origin: document.getElementById('origin').value,
        destination: document.getElementById('destination').value,
        truck_model: document.getElementById('truck_model').value,
        load_weight_tons: parseFloat(document.getElementById('load_weight_tons').value) || 10,
        material_type: document.getElementById('material_type').value,
        
        // Manual/Optional inputs
        manual_mileage: parseFloat(document.getElementById('manual_mileage').value) || null,
        driver_charge: parseFloat(document.getElementById('driver_charge').value) || null,
        
        // State nikalne ka simple logic
        destination_state: document.getElementById('destination').value.split(',').pop().trim(),
        state_changes: 1, 
    };

    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Success: Result ko display karna
            document.getElementById('final-quote').textContent = `₹${result.final_bhada_quote.toLocaleString('en-IN')}`;
            document.getElementById('base-freight').textContent = `₹${result.base_freight_income.toLocaleString('en-IN')}`;
            
            // Breakdown details update karna
            document.getElementById('cost-fuel').textContent = `₹${result.cost_breakdown.fuel.toLocaleString('en-IN')}`;
            document.getElementById('cost-toll').textContent = `₹${result.cost_breakdown.toll.toLocaleString('en-IN')}`;
            
            document.getElementById('result-area').style.display = 'block';
        } else {
            alert(`Calculation Error: ${result.error || 'Something went wrong.'}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Server connection error. Please try again.');
    } finally {
        btn.textContent = 'Calculate Bhada';
        btn.disabled = false;
    }
          }
      
