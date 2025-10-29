function showPopup() {
    Swal.fire({
        title: "How to use this program?",
        html: "<div style='text-align: justify;'>To use this program, you must first answer the form given in the website.<br><br>After doing so, press the 'Predict Flu Probability' button.<br><br>The 'Predicted probability' will then display the percentage of the probability and the model will show green if the probability is 0% to 39%, yellow for 40% to 79% and red for 80%+.<br><br>Lastly, the user can refer to the tab below where they can learn more about the probability that they have gotten.</div>",
        showCloseButton: true,
        icon: 'question',
        confirmButtonColor: '#1981ff',
        width: '500px',
    });
}


window.onload = function() {
    showPopup();
};
  document.getElementById('fluPredictionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const data = {
        temperature: parseFloat(document.getElementById('feature1').value),
        height: parseFloat(document.getElementById('feature2').value),
        weight: parseFloat(document.getElementById('feature3').value),
        illness_days: parseInt(document.getElementById('feature4').value),
        week: parseInt(document.getElementById('feature5').value),
        season: parseInt(document.getElementById('feature6').value),
        fluvaccine: document.getElementById('feature11').value === "Yes" ? 1 : 0,
        increased_cough: document.getElementById('feature12').value === "Yes" ? 1 : 0,
        sputum_cough: document.getElementById('feature13').value === "Yes" ? 1 : 0,
        increased_sorethroat: document.getElementById('feature14').value === "Yes" ? 1 : 0,
        nasal_congestion: document.getElementById('feature15').value === "Yes" ? 1 : 0,
        sinus_pain: document.getElementById('feature16').value === "Yes" ? 1 : 0,
        exposure_to_influenza: document.getElementById('feature17').value === "Yes" ? 1 : 0,
        travel: document.getElementById('feature18').value === "Yes" ? 1 : 0,
        antivirals: document.getElementById('feature19').value === "Yes" ? 1 : 0,
        chronic_lung_disease: document.getElementById('feature20').value === "Yes" ? 1 : 0
    };

    fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        const probability = result.flu_probability.toFixed(2);
        const probDiv = document.getElementById('prob');
        probDiv.innerText = probability + '%';

        if (result.flu_probability >= 80) {
            probDiv.style.color = 'red';
        } else if (result.flu_probability >= 40) {
            probDiv.style.color = 'yellow';
        } else {
            probDiv.style.color = 'green';
        }

        updateBodyParts(result.flu_probability);
    })
    .catch(error => {
        console.error('Error:', error);
    });
  });

  function updateBodyParts(flu_probability) {
    const bodyPartColor = flu_probability >= 80 ? 'red' : flu_probability >= 40 ? 'yellow' : 'green';

    bodyParts.forEach(part => {
        const partElement = document.getElementById(part.name);
        if (partElement) {
            partElement.style.fill = bodyPartColor;
        }
    });
  }

  const STATES = { HEALTHY: 'Healthy', INFECTED: 'Infected', RECOVERING: 'Recovering' };
  let bodyParts = [
    { name: "head", state: STATES.HEALTHY },
    { name: "lungs", state: STATES.HEALTHY },
    { name: "stomach", state: STATES.HEALTHY },
    { name: "throat", state: STATES.HEALTHY },
    { name: "nose", state: STATES.HEALTHY },
    { name: "left-arm", state: STATES.HEALTHY },
    { name: "right-arm", state: STATES.HEALTHY },
    { name: "left-leg", state: STATES.HEALTHY },
    { name: "right-leg", state: STATES.HEALTHY },
  ];

  function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

}