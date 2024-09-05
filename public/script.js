// const { text } = require("body-parser");

let currentIndex = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    const totalSlides = slides.length;
    const visibleSlides = 3; // block 

    if (index >= totalSlides - visibleSlides + 1) {
        currentIndex = totalSlides - visibleSlides;
    } else if (index < 0) {
        currentIndex = 0;
    } else {
        currentIndex = index;
    }

    const offset = -currentIndex * (100 / visibleSlides);
    document.querySelector('.carousel-inner').style.transform = `translateX(${offset}%)`;

    indicators.forEach((indicator, i) => {
        if (i >= currentIndex && i < currentIndex + visibleSlides) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function nextSlide() {
    showSlide(currentIndex + 1);
}

function prevSlide() {
    showSlide(currentIndex - 1);
}

function currentSlide(index) {
    showSlide(index - 1);
}

document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentIndex);
});

document.getElementById('learnNowButton').addEventListener('click', function() {
    // Find the section to scroll to using its ID
    var targetSection = document.getElementById('stem-introduction');
    
    // Scroll into view with smooth behavior
    targetSection.scrollIntoView({ behavior: 'smooth' });
});

// math main bubble
document.querySelectorAll('.math').forEach(mainBubble => {
    mainBubble.addEventListener('click', function() {
        console.log("123")
        math_emp();
        math_income();
        const subBubbles = this.parentElement.querySelectorAll('.sub-bubble');
        subBubbles.forEach(subBubble => {
            if (subBubble.style.opacity === '1') {
                subBubble.style.opacity = '0';
                subBubble.style.pointerEvents = 'none';
            } else {
                subBubble.style.opacity = '1';
                subBubble.style.pointerEvents = 'auto';
            }
        });
    });
});

// engineering main bubble
document.querySelectorAll('.eng').forEach(mainBubble => {
    mainBubble.addEventListener('click', function() {
        math_emp();
        eng_emp();
        eng_income();
        const subBubbles = this.parentElement.querySelectorAll('.sub-bubble');
        subBubbles.forEach(subBubble => {
            if (subBubble.style.opacity === '1') {
                subBubble.style.opacity = '0';
                subBubble.style.pointerEvents = 'none';
            } else {
                subBubble.style.opacity = '1';
                subBubble.style.pointerEvents = 'auto';
            }
        });
    });
});


// technology main bubble
document.querySelectorAll('.tech').forEach(mainBubble => {
    mainBubble.addEventListener('click', function() {
        math_emp();
        tech_employed();
        tech_income();
        const subBubbles = this.parentElement.querySelectorAll('.sub-bubble');
        subBubbles.forEach(subBubble => {
            if (subBubble.style.opacity === '1') {
                subBubble.style.opacity = '0';
                subBubble.style.pointerEvents = 'none';
            } else {
                subBubble.style.opacity = '1';
                subBubble.style.pointerEvents = 'auto';
            }
        });
    });
});
sci_employed

// science main bubble
document.querySelectorAll('.sci').forEach(mainBubble => {
    mainBubble.addEventListener('click', function() {
        math_emp();
        sci_employed();
        sci_income();
        const subBubbles = this.parentElement.querySelectorAll('.sub-bubble');
        console.log('Found sub-bubbles:', subBubbles.length);

        subBubbles.forEach(subBubble => {
            if (subBubble.style.opacity === '1') {
                subBubble.style.opacity = '0';
                subBubble.style.pointerEvents = 'none';
            } else {
                subBubble.style.opacity = '1';
                subBubble.style.pointerEvents = 'auto';
            }
        });
    });
});










/* bubble map */

document.querySelectorAll('.sub-bubble').forEach(bubble => {
  bubble.addEventListener('click', function(event) {
      console.log('myFunction has been called');

      // Remove any existing sub-bubble popups
      document.querySelectorAll('.popup.sub-bubble-popup').forEach(popup => popup.remove());

      // Get the position of the clicked bubble
      const rect = bubble.getBoundingClientRect();
      const containerRect = document.querySelector('.container-mindmap').getBoundingClientRect();

      // Create a new popup
      const popup = document.createElement('div');
      popup.classList.add('popup', 'sub-bubble-popup');

      // Calculate the position of the popup
      let top = rect.top + window.scrollY;
      let left = rect.left + window.scrollX;

      // Adjust position to ensure the popup is within the container
      if (top + 500 > containerRect.bottom + window.scrollY) {
          top = containerRect.bottom + window.scrollY - 600;
      }
      if (left + 500 > containerRect.right + window.scrollX) {
          left = containerRect.right + window.scrollX - 700;
      }
      if (top < containerRect.top + window.scrollY) {
          top = containerRect.top + window.scrollY;
      }
      if (left < containerRect.left + window.scrollX) {
          left = containerRect.left + window.scrollX;
      }

      popup.style.top = `${top}px`;
      popup.style.left = `${left}px`;

      // Add close button
      const closeBtn = document.createElement('div');
      closeBtn.classList.add('close-btn');
      closeBtn.innerHTML = '&times;';
      closeBtn.addEventListener('click', () => popup.remove());

      // Add content to popup
      const content = document.createElement('div');
      content.classList.add('popup-content');

      if (bubble.innerText == 'Info') {
          content.innerHTML = `<ul>${getInfoContent(bubble.id)}</ul>`;
      } else if (bubble.innerText == 'Benefits') {
          content.innerHTML = `<ul>${getBenContent(bubble.id)}</ul>`;
      } else if (bubble.innerText == 'Job' || bubble.innerText == 'Income') {
          content.innerHTML = '<canvas id="chartCanvas" width="400" height="400"></canvas>';
      }

      // Append elements
      popup.appendChild(closeBtn);
      popup.appendChild(content);
      document.body.appendChild(popup);

      if (bubble.innerText == 'Job' || bubble.innerText == 'Income') {
          // Create chart
          const ctx = document.getElementById('chartCanvas').getContext('2d');
          const chartData = getChartData(bubble.id);
          new Chart(ctx, {
              type: bubble.innerText == 'Job' ? 'bar' : 'line',
              data: chartData,
              options: {
                  scales: {
                      y: {
                          beginAtZero: true
                      }
                  }
              }
          });
      }
  });
});


// math_employed#########################################
// Define global variables
var math_emp_years = [];
var math_emp_values = []
var math_emp_ind =[]

// Use fetch to get data
function math_emp(){
  fetch('data/math_employed.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data and store it into global variables
    math_emp_ind = data.map(item => item.Industry);
    math_emp_years = data.map(item => item.Year);
    math_emp_values = data.map(item => item.Value);
    console.log("11111111",math_emp_values)

  })
  .catch(error => {
    console.error('There was a problem(math_employed) with the fetch operation:', error);
  });
}

// math_employed#########################################





// math_income#########################################
// Define global variables
let math_income_years = [];
let math_income_values = []
let math_income_ind =[]
// Use fetch to get data
function math_income(){
    fetch('data/math_income.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data and store it into global variables
    math_income_ind = data.map(item => item.Industry);
    math_income_years = data.map(item => item.Year);
    math_income_values = data.map(item => item.Value);
    console.log("2222222222",math_income_values)
  })
  .catch(error => {
    console.error('There was a problem(math_income) with the fetch operation:', error);
  });
}

// math_income#########################################





// engineering_employed#########################################
// Define global variables
let eng_emp_years = [];
let eng_emp_values = []
let eng_emp_ind =[]

// Use fetch to get data
function eng_emp(){
   fetch('data/engineering_employed.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data and store it into global variables
    eng_emp_ind = data.map(item => item.Industry);
    eng_emp_years = data.map(item => item.Year);
    eng_emp_values = data.map(item => item.Value);
    console.log("333333333",eng_emp_values)

  })
  .catch(error => {
    console.error('There was a problem(engineering_employed) with the fetch operation:', error);
  });

}

// engineering_employed#########################################





// engineering_income#########################################
// Define global variables
let eng_income_years = [];
let eng_income_values = []
let eng_income_ind =[]

// Use fetch to get data
function eng_income(){
   fetch('data/engineering_income.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data and store it into global variables
    eng_income_ind = data.map(item => item.Industry);
    eng_income_years = data.map(item => item.Year);
    eng_income_values = data.map(item => item.Value);
    console.log("444444",eng_emp_values)

  })
  .catch(error => {
    console.error('There was a problem(engineering_income) with the fetch operation:', error);
  });

}

// engineering_income#########################################





// tech_employed#########################################
// Define global variables
let tech_employed_years = [];
let tech_employed_values = []
let tech_employed_ind =[]

// Use fetch to get data
function tech_employed(){
   fetch('data/tech_employed.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data and store it into global variables
    tech_employed_ind = data.map(item => item.Industry);
    tech_employed_years = data.map(item => item.Year);
    tech_employed_values = data.map(item => item.Value);
    console.log("55555555",tech_employed_values)

  })
  .catch(error => {
    console.error('There was a problem(tech_employed) with the fetch operation:', error);
  });

}

// tech_employed#########################################




// tech_income#########################################
// Define global variables
let tech_income_years = [];
let tech_income_values = []
let tech_income_ind =[]

// Use fetch to get data
function tech_income(){
   fetch('data/tech_income.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data and store it into global variables
    tech_income_ind = data.map(item => item.Industry);
    tech_income_years = data.map(item => item.Year);
    tech_income_values = data.map(item => item.Value);
    console.log("66666666",tech_income_values)

  })
  .catch(error => {
    console.error('There was a problem(tech_income) with the fetch operation:', error);
  });

}

// tech_income#########################################



// sci_employed#########################################
// Define global variables
let sci_employed_years = [];
let sci_employed_values = []
let sci_employed_ind =[]

// Use fetch to get data
function sci_employed(){
   fetch('data/science_employed.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data and store it into global variables
    sci_employed_ind = data.map(item => item.Industry);
    sci_employed_years = data.map(item => item.Year);
    sci_employed_values = data.map(item => item.Value);
    console.log("7777777777777",sci_employed_values)

  })
  .catch(error => {
    console.error('There was a problem(sci_employed) with the fetch operation:', error);
  });

}

// sci_employed#########################################


// sci_income#########################################
// Define global variables
let sci_income_years = [];
let sci_income_values = []
let sci_income_ind =[]

// Use fetch to get data
function sci_income(){
   fetch('data/science_income.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data and store it into global variables
    sci_income_ind = data.map(item => item.Industry);
    sci_income_years = data.map(item => item.Year);
    sci_income_values = data.map(item => item.Value);
    console.log("88888888",sci_income_values)

  })
  .catch(error => {
    console.error('There was a problem(sci_income) with the fetch operation:', error);
  });

}

// sci_employed#########################################





function getChartData(bubbleId) {
    console.log("bubbleid:",bubbleId)
    // Define different datasets for different bubbles
    const datasets = {
        // 'subBubble1-1': [12, 19, 3, 5, 2, 3],
        'subBubble1-2': math_emp_values,
        'subBubble1-3': math_income_values,
        // 'subBubble2-1': [10, 20, 30, 40, 50, 60],
        'subBubble2-2': eng_emp_values,
        'subBubble2-3': eng_income_values,
        // 'subBubble3-1': [2, 4, 6, 8, 10, 12],
        'subBubble3-2': tech_employed_values,
        'subBubble3-3': tech_income_values,
        // 'subBubble4-1': [13, 26, 39, 52, 65, 78],
        'subBubble4-2': sci_employed_values,
        'subBubble4-3': sci_income_values,
    };

    return {
        labels: math_emp_years,
        datasets: [{
            label: 'Unit: 000',
            data: datasets[bubbleId] || [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 5
        }]
    };
}

function getInfoContent(bubbleId) {
    const info = {
        'subBubble1-1': `
            <h3>Science</h3>
            <li>Science is the systematic study of the natural world through observation and experimentation.</li>
            <li>It aims to understand how the universe works and to develop new knowledge.</li>
            <li>Scientific research is essential for technological advancements and societal progress.</li>
        `,
        'subBubble2-1': `
            <h3>Technology</h3>
            <li>Technology refers to the use of scientific knowledge for practical purposes.</li>
            <li>It includes the development and use of tools, machines, and systems.</li>
            <li>Technology plays a crucial role in modern society, impacting various industries.</li>
        `,
        'subBubble3-1': `
            <h3>Engineering</h3>
            <li>Engineering involves the application of science and math to solve problems.</li>
            <li>Engineers design, build, and maintain structures, machines, and systems.</li>
            <li>There are various branches of engineering including civil, mechanical, and electrical.</li>
        `,
        'subBubble4-1': `
            <h3>Mathematics</h3>
            <li>Mathematics is the study of numbers, shapes, and patterns.</li>
            <li>It is essential for various fields including science, engineering, and finance.</li>
            <li>Mathematicians use mathematical theories and techniques to solve practical problems.</li>
        `
    };

    return info[bubbleId] || '<li>No information available.</li>';
}

function getBenContent(bubbleId) {
  const info = {
      'subBubble1-4': 
      `   
          <h2>Science</h2>
          <h3>A background in science offers young female student not only the skills and knowledge to excel in STEM indsutries but also the confidence, opportunities and inspiration to make meaningful contributions to society and the world</h3>      `,
      'subBubble2-4': `
          <h2>Technology</h2>
          <h3>Technology is a critical component in stem industries, they drive efficiency, innovate, and enhance research capabilities and support the development solution that adress complex global challange.</h3>
      `,
      'subBubble3-4': `
          <h2>Engineering</h2>
          <h3>Engineering is an essentialto the advancement of all industries, by providing the technical expertise and innovate thinking. </h3>
      `,
      'subBubble4-4': 
      `   <h2>Mathematics</h2>
          <h3>Mathematics have a lot of benefit, some it is encourage us to do critical thinking, providing necessary skills and knowledge to tackle complex challanges, innovate and drive technological and scientific advancement</h3>
      `
  };

  return info[bubbleId] || '<li>No information available.</li>';
}



/* role model */
document.querySelectorAll('.role-model').forEach(roleModel => {
    roleModel.addEventListener('click', function() {
        const roleId = this.getAttribute('data-id');
        showRoleModelPopup(roleId);
    });
});

function showRoleModelPopup(roleId) {
    // Remove any existing role model popups
    document.querySelectorAll('.role-model-popup').forEach(popup => popup.remove());

    // Get the role model data
    const roleModelData = getRoleModelData(roleId);

    // Create a new popup
    const popup = document.createElement('div');
    popup.classList.add('role-model-popup');

    // Add close button
    const closeBtn = document.createElement('div');
    closeBtn.classList.add('close-btn');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => popup.remove());

    // Add content to popup
    const content = document.createElement('div');
    content.classList.add('popup-content');
    content.innerHTML = `
        <img src="${roleModelData.image}" alt="${roleModelData.name}">
        <h2>${roleModelData.name}</h2>
        <ul>${roleModelData.details.map(detail => `<li>${detail}</li>`).join('')}</ul>
    `;

    // Append elements
    popup.appendChild(closeBtn);
    popup.appendChild(content);
    document.body.appendChild(popup);
}

function getRoleModelData(roleId) {
    const data = {
        '1': {
            image: './images/role_model_1.jpg',
            name: 'List of Accolades',
            details: [ "1. 2022 Dean's Award for  Postrgraduate Supervision, Faculty of Arts, 2022",
                "2. 2022 Vice Chancellor's Award for Postgraduate Supervision, Monash University, 2022",
                "3. Fellow of the Academy of Social Science in Australia, 2020",
                "4. Medal and Citations for Excellence in Scholarship in the Social Science, 2000",
                "5. 80 Research Articles",
                "6. 15 Projecs"

            ]
        },
        '2': {
            image: './images/role_model_2.jpg',
            name: 'List of Accolades',
            details: [
                "1. The Optical Society C.E.K. Mees Medal 'For pioneering innovations in the transfer of optical angular momentum to particles, using sculpted light for laser manipulation on atomic, nano- and microscales to generate fundamental insight and provide powerful probes to biomedicine.', 2021",
                "2. Lise Meitner Lectures 'Sculpted light in nano and microsystem', 2019",
                "3. UNSW Eureka Prize for excellence in Interdisplinary Scientific Research, 2018",
                "4. Office of the Order Australia, 2018",
                "5. Fellow of the Australian Academy of Science, 2016",
                "6. Fellow of The Optical Society, 2012",
                "7. Fellow of SPIE, the international society for optics and photonics , 2011",
                "8. AIP Women in Physics lecturer, 2003"
               ]
        },
        '3': {
            image: './images/role_model_3.jpg',
            name: 'List of Accolades',
            details: [
                "1. Fellowships of the Australian Academy of Science, 2021",
                "2. Fellowships of The Royal Society of Chemistry, 2000",
                "3. Honorary Member of British Biophysical Society, 2019",
                "4. Nominated as a member of the Analytical Science Power list, 2015",
                "5. 229 Research Articles"
               ]
        }
    };

    return data[roleId] || {};
}



