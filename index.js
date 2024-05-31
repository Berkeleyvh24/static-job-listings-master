let jsonData;
let filteredJsonData;
let filterSet = [];

function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data.json', true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        callback(JSON.parse(xobj.responseText));
      }
    };
    xobj.send(null);  
}

loadJSON( async function(json) {
    jsonData = await json
    filteredJsonData = jsonData
    console.log('loadjson')
    console.log(jsonData.length);  

    createHtmlElements(filteredJsonData)
    let filters = document.getElementById('filters')
    let buttonList = document.getElementById('jobListings')
    let clearButton = document.getElementById('clearAllFilters')


    
    clearButton.addEventListener('click', (event) => {
        filters.innerHTML = '';
        filterSet.length = 0;
        createHtmlElements(jsonData)
    })

    filters.addEventListener('click', (event) => {
        const isButton = event.target.nodeName === 'BUTTON';
        const isImg = event.target.nodeName === 'IMG'
        if (!isButton && !isImg) {
            return;
        }
        if(!isButton){
            filterSet.splice(event.target.parentNode.parentNode.id, 1)
            event.target.parentNode.parentNode.remove()
        }else{
            
            filterSet.splice(event.target.parentNode.id, 1)
            event.target.parentNode.remove()
        }
        createHtmlElements(jsonData)
    })

    buttonList.addEventListener('click', (event) => {
        const isButton = event.target.nodeName === 'BUTTON';
        if (!isButton) {
          return;
        }
        let innerText = event.target.innerHTML

        if(filterSet.includes(innerText)){   
            return;
        }else{
            let filter = document.createElement("div");
            filter.classList.add("filter")
            let filterText = document.createElement("span");
            let filterButton = document.createElement("button")
            let filterRemove = document.createElement("img")
            filterSet.push(innerText)
            let idIndex = filterSet.indexOf(innerText)
            filter.id = (`${idIndex}`)
            filterRemove.src = "images/icon-remove.svg"
            filterRemove.alt = "remove"
            filterButton.appendChild(filterRemove)
            filterText.innerHTML = `${innerText}`
            filter.appendChild(filterText)
            filter.appendChild(filterButton)
            filters.appendChild(filter)

            createHtmlElements(filteredJsonData)
        }
      })
});

function loadListings(data){
    // I want to remove a joblisting if the filter is not in the filterSet
    return data.filter(job => {
        if(filterSet.length == 0){
            return true
        }
        let comboArray = []
        comboArray = comboArray.concat(job.languages);
        comboArray.push(job.role);
        comboArray.push(job.level);

        const allFiltersExist = filterSet.every(filter => comboArray.includes(filter));

        return allFiltersExist;
    });
}

function createHtmlElements(data){
    let jobsDisplay = document.getElementById('jobListings')
    jobsDisplay.innerHTML = ''
    console.log(filteredJsonData)
    console.log('--------------------------------')
    filteredJsonData = loadListings(data)
    console.log('+++++++++++++++++++++++')
    console.log(filteredJsonData)
    for (const property in filteredJsonData) {
        addHtmlElement(property);
    }
}

function addHtmlElement(jsonIndex){
    let jobListings = document.getElementById("jobListings");
    let jobListing = document.createElement("li");
    jobListing.setAttribute("id", `jobListing${jsonIndex}`);
    let img = document.createElement("img")
    img.src = `${filteredJsonData[jsonIndex].logo}`
    jobListing.appendChild(img)
    let startListItems = document.createElement("div");
    startListItems.classList.add("startListingItems")
    let companyAndLabels = document.createElement("div");
    companyAndLabels.classList.add("companyAndLabels")
    let companyName = document.createElement("span");  
    companyName.classList.add("companyName")
    companyName.innerHTML = `${filteredJsonData[jsonIndex].company}`
    let newTag = document.createElement("span");  
    newTag.classList.add("newTag")
    newTag.innerHTML = 'NEW!'
    if(filteredJsonData[jsonIndex].new){
        newTag.style.visibility = "visible"
    }else{
        newTag.style.visibility = "hidden"
    }
    let featuredTag = document.createElement("span");
    featuredTag.classList.add("featuredTag")
    featuredTag.innerHTML = 'FEATURED'
    if(filteredJsonData[jsonIndex].featured){
        featuredTag.style.visibility = "visible"
    }else{
        featuredTag.style.visibility = "hidden"
    }  
    let position = document.createElement("div")
    position.classList.add("position")
    position.innerHTML = `${filteredJsonData[jsonIndex].position}`

    let extraDetails = document.createElement("div")
    extraDetails.classList.add("extraDetails")
    extraDetails.innerHTML = `${filteredJsonData[jsonIndex].postedAt}  •  ${filteredJsonData[jsonIndex].contract}  •  ${filteredJsonData[jsonIndex].location}`
    let endListItems = document.createElement("div");
    let filterButtons = document.createElement("div");
    endListItems.classList.add("endListingItems")
    filterButtons.classList.add("filterButtons")
    filterButtons.setAttribute("id", 'filterButtonsId');

    let roleButton = document.createElement("button");
    let levelButton = document.createElement("button")
    roleButton.innerHTML = `${filteredJsonData[jsonIndex].role}`
    levelButton.innerHTML = `${filteredJsonData[jsonIndex].level}`
    let langArrSize = filteredJsonData[jsonIndex].languages.length
    let langArr = filteredJsonData[jsonIndex].languages
    let toolsArrSize = filteredJsonData[jsonIndex].tools.length
    let toolsArr = filteredJsonData[jsonIndex].tools
    companyAndLabels.appendChild(companyName)
    companyAndLabels.appendChild(newTag)
    companyAndLabels.appendChild(featuredTag)
    startListItems.appendChild(companyAndLabels)
    startListItems.appendChild(position)
    startListItems.appendChild(extraDetails)
    filterButtons.appendChild(roleButton)
    filterButtons.appendChild(levelButton)
    for(let i = 0; i < langArrSize; i++) {
        let obj = langArr[i];
        let langButton = document.createElement("button");
        langButton.innerHTML = obj
        filterButtons.appendChild(langButton)
    }
    for(let i = 0; i < toolsArrSize; i++) {
        let obj = toolsArr[i];
        let toolsButton = document.createElement("button");
        toolsButton.innerHTML = obj
        filterButtons.appendChild(toolsButton)
    }
    endListItems.appendChild(filterButtons)
    jobListing.appendChild(startListItems)

    jobListing.appendChild(endListItems)
    jobListings.appendChild(jobListing)
    
}