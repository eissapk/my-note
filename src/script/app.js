/**
 * @author Eissa Saber
 * @version 1.1.0
 */

//* Register the Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("/my-note/serviceWorker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err));
    });
}

//? control mode
class Nav {
    static global() {
        Nav.modeCon = document.getElementById('mode');
        Nav.mode = true;
    }

    // mode switcher 
    static modeSwitcher(e) {
        // select buttons
        const [moon, sun] = document.querySelectorAll('#mode button');
        // select stylesheet of darkmode
        const stylesheet = document.querySelector("[title=darkmode]");

        if (e.target.classList.contains('toggleMode')) {
            if (Nav.mode) { // dark mode
                // switch btns
                moon.classList.add('activeMode');
                sun.classList.remove('activeMode');

                // enable sheet
                stylesheet.removeAttribute('disabled');

                // die
                Nav.mode = false;

            } else { // light mode
                // switch btns
                moon.classList.remove('activeMode');
                sun.classList.add('activeMode');

                // disable sheet
                stylesheet.setAttribute('disabled', "");

                // die
                Nav.mode = true;
            }

        }
    }

}

//? sync date
class Header {
    static global() {}

    static syncDate() {
        // select time container
        const timeCon = document.querySelector('#date h1');
        // select date container
        const dateCon = document.querySelector('#date p');
        // get date
        const date = new Date();

        //! hours
        // am, pm basis
        const hArr = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const hours = date.getHours();
        const hours_12 = hArr[hours];

        let hL = String(hours_12).length;
        let h = "";
        let am_pm = "";

        // detect chars length
        if (hL == 1) { // one char
            h = `0${hours_12}`;

        } else { // two chars
            h = `${hours_12}`;
        }

        // detect am, pm
        if (hours >= 12) {
            am_pm = "PM";
        } else {
            am_pm = "AM";
        }

        //! minutes
        const minutes = date.getMinutes();
        let mL = String(minutes).length;
        let m = "";

        if (mL == 1) { // one char
            m = `0${minutes}`;

        } else { // two chars
            m = `${minutes}`;
        }

        //! month
        const mArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        const month = date.getMonth();

        //! day
        const day = date.getDate();

        //* sync time
        timeCon.innerHTML = `${h} : ${m} <i id="am-pm">${am_pm}</i>`;
        //* sync date
        dateCon.innerHTML = `${mArr[month]} ${day}`;
    }

}

// ?control tabs
class Tabs {
    static global() {
        Tabs.slider = document.getElementById('tabsSlider');
        Tabs.btnsCon = document.querySelector('.sliderBtns');
        Tabs.isDown = false;
        Tabs.startX;
        Tabs.scrollLeft;
    }

    // switch tab
    static tabSwichter(e) {
        // select all input
        const all = document.getElementById('selectAll');
        // get clicked elem
        const elm = e.target;
        // get all tabs
        const tabs = document.querySelectorAll('.tab');

        if (e.target.classList.contains('tab') || e.target.classList.contains('tasksNum') || e.target.classList.contains('noteTitle')) {
            // !reset all tabs
            tabs.forEach(item => item.classList.remove('currentTab'));
            //! uncheck select all
            all.checked = false;
        }

        if (e.target.classList.contains('tab')) {
            // *active clicked tab
            elm.classList.add('currentTab');
        }

        if (e.target.classList.contains('tasksNum')) {
            // *active clicked tab
            elm.parentElement.classList.add('currentTab');
        }

        if (e.target.classList.contains('noteTitle')) {
            // *active clicked tab
            elm.parentElement.classList.add('currentTab');
        }
    }

    // update title
    static noteTitle() {
        // select all title inputs
        const titles = document.querySelectorAll('.noteTitle');

        // loop through noteTitle
        titles.forEach(title => {
            // add keyup event
            title.addEventListener('keyup', (e) => {
                // update arr from localStorage
                let arr = Store.getTask();

                // get current tab
                const tab = document.querySelector('.currentTab');
                // get tab title
                const tasks = tab.querySelectorAll('.content .textCon');

                // update title attr
                title.setAttribute('title', `${e.target.value}`);

                // loop through tasks
                tasks.forEach(task => {
                    // update tasks attr tab in UI
                    task.setAttribute('data-tab', `${e.target.value}`);

                    //* update tab title of myTask Object in Store
                    arr.forEach(item => {
                        if (item.id == task.getAttribute('data-id')) {
                            item.tab = e.target.value;
                        }
                    });

                    //! store tasks to localStorage
                    localStorage.setItem('tasks', JSON.stringify(arr));

                });

            });
        });

        // update title without keyup event
        titles.forEach(title => {
            title.setAttribute('title', `${title.value}`);
        });
    }

    // scroll tabs next/prev
    static navigateTabs(e) {
        if (e.target.classList.contains('nextBtn')) { // scroll right
            Tabs.slider.scrollBy({
                top: 0,
                left: 170,
                behavior: 'smooth'
            });
        }

        if (e.target.classList.contains('prevBtn')) { // scroll left
            Tabs.slider.scrollBy({
                top: 0,
                left: -170,
                behavior: 'smooth'
            });
        }
    }

    // scroll slider by mouse
    static navSliderByMouse() {
        // mouse down
        Tabs.slider.addEventListener('mousedown', (e) => {
            // active down
            Tabs.isDown = true;
            // *get startX point
            Tabs.startX = e.pageX - Tabs.slider.offsetLeft;
            // !store last scrollleft value
            Tabs.scrollLeft = Tabs.slider.scrollLeft;
        });

        // mouse leave
        Tabs.slider.addEventListener('mouseleave', () => {
            // disable down
            Tabs.isDown = false;
        });

        // mouse up
        Tabs.slider.addEventListener('mouseup', () => {
            // disable down
            Tabs.isDown = false;
        });

        // mouse move
        Tabs.slider.addEventListener('mousemove', (e) => {
            if (Tabs.isDown) { // if isDown true
                // prevent default behaviour
                e.preventDefault();
                // get moveTo point
                const x = e.pageX - Tabs.slider.offsetLeft;
                // calc diff
                const walk = (x - Tabs.startX);
                // continue scroll from last scrollleft value - walk
                Tabs.slider.scrollLeft = Tabs.scrollLeft - walk;
            }
        });
    }

    // scroll slider by touch
    static navSliderByTouch() {
        // touchstart
        Tabs.slider.addEventListener('touchstart', (e) => {
            // active down
            Tabs.isDown = true;
            // *get startX point
            Tabs.startX = e.touches[0].pageX - Tabs.slider.offsetLeft;
            // !store last scrollleft value
            Tabs.scrollLeft = Tabs.slider.scrollLeft;
        });

        // touchend
        Tabs.slider.addEventListener('touchend', () => {
            // disable down
            Tabs.isDown = false;
        });

        // touchmove
        Tabs.slider.addEventListener('touchmove', (e) => {
            if (Tabs.isDown) { // if isDown true
                // stop touch event
                e.stopPropagation();
                // get moveTo point
                const x = e.touches[0].pageX - Tabs.slider.offsetLeft;
                // calc diff
                const walk = (x - Tabs.startX);
                // continue scroll from last scrollleft value - walk
                Tabs.slider.scrollLeft = Tabs.scrollLeft - walk;
            }
        });

    }

}

//? handle UI
class UI {

    static global() {
        // select elements
        UI.slider = document.getElementById('tabsSlider');
        UI.addNoteBtnCon = document.getElementById('addNote');
        UI.saveBtn = document.getElementById('saveBtn');
        UI.delBtnCon = document.querySelector('.deleteCon');
        UI.all = document.getElementById('selectAll');
        UI.tabNum = 2;
        UI.lastTap;
        this.settingsBtn = document.querySelector('.settingsBtn');
        this.settingsCloseBtn = document.querySelector('.settingsLayer--closeBtn');
        this.settingsLayer = document.querySelector('.settingsLayer');
    }

    // backup/update data 
    static syncData(e) {
        // select elms 
        const file = document.querySelector('.settingsLayer--input');

        if (e.target.classList.contains('settingsLayer__innerWrapper--backupBtn')) { // backup
            // get stored data 
            const data = localStorage.getItem('tasks');
            if (JSON.parse(data) !== null && (JSON.parse(data)).length) {
                // make file 
                const a = document.createElement("a");
                const _file = new Blob([data], {
                    type: 'application/json'
                });
                a.href = URL.createObjectURL(_file);
                a.download = 'data.json';
                a.click();
            } else {
                alert('No Data to Backup!');
            }
        } else if (e.target.classList.contains('settingsLayer__innerWrapper--updateBtn')) { // update
            file.click();
        }

        // extract data from file 
        file.addEventListener('change', e => {
            const reader = new FileReader();
            reader.readAsText(e.target.files[0]);
            reader.onload = e => {
                const data = e.target.result;

                if (JSON.parse(data) !== null && (JSON.parse(data)).length) {
                    //! update storage 
                    localStorage.setItem('tasks', data);
                    //! wipe out tabs 
                    const tabs = [].slice.call(document.querySelectorAll("#tabsSlider .tab"));
                    if (tabs.length) {
                        tabs.forEach(tab => tab.remove());
                    }
                    //* update UI 
                    UI.animateTabBtn();
                    Store.loadTasks();
                    // hide settings layer 
                    UI.settingsLayer.style.display = "none";

                } else {
                    alert('No Data in This File!');
                }
            };
        });
    }

    // *showTextarea
    static showTextarea(e) {
        // select layer
        const layer = document.getElementById('inputBoxWrapper');
        // select textarea
        const textarea = layer.querySelector('#input');

        //* if add note button clicked
        if (e.target.classList.contains('addNoteBtn')) { // if addNoteBtn class clicked
            // show layer
            layer.style.display = 'block';
            // add focus
            textarea.focus();
        }
    }

    // !hideTextarea
    static hideTextarea() {
        // select cancel buttons
        const btns = document.querySelectorAll('.cancelBtn');
        // add click event
        btns.forEach(btn => btn.addEventListener('click', e => e.target.parentElement.parentElement.parentElement.style.display = 'none'));
    }

    // *add new tab
    static addNewTab(e) {
        // select tabs slider
        const slider = document.getElementById('tabsSlider');
        // select add new tab button
        const btn = document.getElementById('addNewTab');

        //* if add tab button clicked 
        if (e.target.classList.contains('clickAddTab')) { // if clickAddTab class clicked
            // sync tab tasks' number
            let num = UI.tabNum++;
            // select all tabs
            const tabs = document.querySelectorAll('.tab');
            // reset number if all tabs deleted
            if (tabs.length === 0) {
                UI.tabNum = 1;
                num = UI.tabNum++;
            }

            //! remove currentTab class from all tabs
            const tab = document.querySelector('.currentTab');
            if (tab) tab.classList.remove('currentTab');

            // create div
            const div = document.createElement('div');
            // add class
            div.className = 'tab currentTab';
            // append to div
            div.innerHTML = `
                                <span class="tasksNum"></span>

                                <input class="noteTitle" type="text" value="New Note (${num})" placeholder="New Note (${num})" readonly>
                                
                                <button class="xBtn" type="button">
                                    <i class="clickXBtn"></i>
                                    <span class="clickXBtn"></span>
                                    <span class="clickXBtn"></span>
                                </button>
                                
                                <div class="content">
                                    <ul></ul>
                                </div>
                                `;

            //* append new tab before addBtn
            slider.insertBefore(div, btn);
            //* init titleUpdate fn
            Tabs.noteTitle();

            // init tab btn animation
            UI.animateTabBtn();
        }

    }

    // !remove tab
    static removeTab(e) {
        // select confirm parent
        const parent = document.getElementById('checkQWrapper');
        // select confirm child
        const child = document.getElementById('checkQ');

        //! if remove button clicked
        if (e.target.classList.contains('clickXBtn')) { // if clickXBtn class clicked
            //* update child content
            child.innerHTML = `
                                <div>
                                    <p>Are you really want to delete this?</p>
                                </div>
                                <div>
                                    <button type="button" id="cancelBtn2">cancel</button>
                                    <button type="button" id="deleteBtn">delete</button>
                                </div>
                                `;

            // select all tasks of selected tab
            const tasks = e.target.parentElement.parentElement.querySelectorAll('.content li');

            if (tasks.length > 0) { // if tab is full of tasks
                // *show confirm parent
                parent.style.display = "block";
            } else { // if tab empty of tasks

                // *select tab
                const tab = e.target.parentElement.parentElement;

                // !remove currentTab class from all tabs
                const allTabs = document.querySelectorAll('.tab');
                allTabs.forEach(tab => tab.classList.remove('currentTab'));

                // *select previous tab
                const prevTab = tab.previousElementSibling;
                // * add currentTab class
                if (prevTab) { // if exists
                    prevTab.classList.add('currentTab');
                } else { // if no prev element exists | add to next then
                    tab.nextElementSibling.classList.add('currentTab');
                }

                // init remove tab
                Store.removeTab(tab);

                // remove clicked tab
                tab.remove();

            }

            // select delete button
            const delBtn = document.getElementById('deleteBtn');
            //* add click event to delete button
            delBtn.addEventListener('click', () => { // if delete button clicked
                // *select tab
                const tab = e.target.parentElement.parentElement;

                // !remove currentTab class from all tabs
                const allTabs = document.querySelectorAll('.tab');
                allTabs.forEach(tab => tab.classList.remove('currentTab'));

                // *select previous tab
                const prevTab = tab.previousElementSibling;
                // * add currentTab class
                if (prevTab) { // if exists
                    prevTab.classList.add('currentTab');
                } else { // if no prev element exists | add to next then
                    tab.nextElementSibling.classList.add('currentTab');
                }

                // init remove tab
                Store.removeTab(tab);

                // remove clicked tab
                tab.remove();

                // !hide confirm parent
                parent.style.display = "none";

                // init tab btn animation
                UI.animateTabBtn();
            });

            // select cancel button
            const cancelBtn = document.getElementById('cancelBtn2');
            //! add click event to cancel button | hide confirm parent
            cancelBtn.addEventListener('click', () => parent.style.display = "none");

            // init tab btn animation
            UI.animateTabBtn();

        }

    }

    //* add task to tab
    static addTask() {
        return new Promise((resolve, reject) => {
            let error = false;
            const regex = /&nbsp;|[\n\r]|\u21b5|↵/g; // for detecting space and line break
            // select textarea element
            const input = document.getElementById('input');
            // select current tab
            const currentTab = document.querySelector('.currentTab .content ul');
            // select tab
            const tab = document.querySelector('.tab');

            if (!error) {
                //! show alert if there are no tabs
                if (!tab) {
                    alert('Please create a tab!');
                } else { //* if there are tabs
                    // check if inserted value not empty
                    if (input.value.trim() != "") {
                        // create li 
                        const li = document.createElement('li');
                        // add content to li
                        li.innerHTML = `
                                <span class="editCon">
                                    <img src="img/edit-pen.svg" class="editNote" alt="edit-pen">
                                </span>
                                <span class="selectCon">
                                    <label>
                                        <input class="selectItem" type="checkbox">
                                        <span class="check"></span>
                                    </label>
                                </span>
                                <span class="textCon" data-id="${UI.makeId()}" data-tab="${UI.getTabTitle()}">${input.value.replace(regex, "<br>")}</span>
                                `;

                        //* append li to currentTab
                        currentTab.append(li);

                        //? init add task
                        Store.addTask(li);

                        // init tasks number
                        UI.tasksNum();

                        //! wipe out textarea
                        input.value = '';

                        //! hide textarea
                        document.getElementById('inputBoxWrapper').style.display = 'none';
                    } else {
                        // select textarea 
                        const inputBox = document.getElementById('inputBox');
                        //* add class 
                        inputBox.classList.add('emptyInput');
                        //! remove class
                        setTimeout(() => {
                            inputBox.classList.remove('emptyInput');
                        }, 300);
                    }
                }
                resolve();
            } else {
                reject('Error while creating your task!')
            }
        });
    }

    //! remove task from tab
    static removeTask(e) {
        //* if delete button clicked
        if (e.target.classList.contains('deleteBtn')) { // if deleteBtn class clicked
            // select tasks
            const tasks = document.querySelectorAll('.currentTab .content li .selectItem');

            // loop through tasks
            tasks.forEach(task => {
                if (task.checked) {
                    // get li
                    const li = task.parentElement.parentElement.parentElement;
                    // get removed task id
                    const id = li.querySelector('.textCon').getAttribute('data-id');
                    // remove checked lis
                    li.remove();

                    // init remove task
                    Store.removeTask(id);

                } else {
                    return;
                }
            });

            //! uncheck select all
            document.getElementById('selectAll').checked = false;

            // init tasks number
            UI.tasksNum();
        }
    }

    // edit task from tab
    static editTask(e) {
        // select layer
        const layer = document.getElementById('editBoxWrapper');

        //* if edit btn clicked
        if (e.target.classList.contains('editNote')) {
            // get task
            let task = e.target.parentElement.parentElement.querySelector('.textCon');
            // get task id
            let id = task.getAttribute('data-id');

            //* update layer content for seperating each task
            layer.innerHTML = `
                                <div id="editBox">
                                <div class="top">
                                    <button class="cancelBtn" type="button">cancel</button>
                                    <button type="button" id="updateBtn">update</button>
                                </div>
                                <div class="bottom">
                                    <textarea id="editInput" placeholder="Edit Your Note Here..."></textarea>
                                </div>
                                </div>
                                `;

            // select textarea
            const textarea = document.getElementById('editInput');
            // select update button
            const btn = document.getElementById('updateBtn');
            const editBox = document.getElementById("editBox");

            // init hideTextarea fn
            UI.hideTextarea();

            //* show layer
            layer.style.display = 'block';
            // sync task value
            textarea.value = task.innerText;
            // add focus 
            textarea.focus();

            //* add click event to update button
            btn.addEventListener('click', () => {
                if (textarea.value.trim() != "") {
                    // update task
                    task.innerText = textarea.value;
                    // init edit task
                    Store.editTask(id, textarea.value);
                    //! hide layer
                    layer.style.display = 'none';
                    // wipe out field
                    textarea.value = '';
                } else {
                    editBox.classList.add('emptyInput');
                    setTimeout(() => editBox.classList.remove('emptyInput'), 300);
                }
            });

        }

    }

    // generate unique id
    static makeId() {
        let id = new Date().getTime();
        return id;
    }

    // tab title
    static getTabTitle() {
        // get current tab
        const tab = document.querySelector('.currentTab');
        // get tab title
        const input = tab.querySelector('.noteTitle');
        return input.value;
    }

    // tasks number
    static tasksNum() {
        // get currentTab
        const tab = document.querySelector('.currentTab');
        // select tasks
        const tasks = tab.querySelectorAll('.content ul li');
        // select num container
        const numCon = tab.querySelector('.tasksNum');

        if (tasks.length < 1) {
            numCon.textContent = "";
        } else {
            numCon.textContent = `(${tasks.length})`;
        }

    }

    // select all tasks at once
    static selectAll() {
        // select all input
        const all = document.getElementById('selectAll');
        // select all tasks in current tab
        const tasks = document.querySelectorAll('.currentTab .content li .selectItem');

        if (all.checked) { //* if all selected
            tasks.forEach(task => task.checked = true);
        } else { //! if all not selected 
            tasks.forEach(task => task.checked = false);
        }
    }

    // handle add tab button Animation
    static animateTabBtn() {
        // get tasks from localStorage
        let arr = Store.getTask();
        // select all tabs
        const tabs = document.querySelectorAll('.tab');
        // convert it to Array
        const myTabs = Array.from(tabs);
        // select btn
        const btn = document.querySelector('#addNewTab div');

        if (arr.length > 0 || myTabs.length > 0) { // empty of tabs
            btn.classList.remove('animateAddNewTab');
        } else {
            btn.classList.add('animateAddNewTab');
        }
    }

    // renameTab
    static renameTab(e) {
        if (e.target.classList.contains('noteTitle')) { // if dbl clicked on tab input
            // get time at 1st click
            let firstTap = new Date().getTime();
            // get diffrence between 1st and last click
            let differ = firstTap - UI.lastTap;

            if ((differ < 600) && (differ > 0)) { // if dbl click occured during 0.6 second
                //* remove disable attr
                e.target.removeAttribute('readonly');
                // add focus
                e.target.focus();
                // add cursor shape
                e.target.style.cursor = 'text';
            }

            // get time at last click
            UI.lastTap = new Date().getTime();
        }
    }

    // disableRename
    static disableRename(e) {
        if (e.target.classList.contains('noteTitle')) { // if blured tab input
            //! add disable attr
            e.target.setAttribute('readonly', '');
            // add cursor shape
            e.target.style.cursor = 'pointer';
        }
    }

    // search engine
    static engine() {
        // select engine input 
        const input = document.getElementById('engine');

        //* add keyup event to input
        input.addEventListener('keyup', () => {
            // get input value
            let value = input.value.toLowerCase().replace(/^\s+/g, '').slice(0, 3);

            // select tasks in current tab
            const tasks = document.querySelectorAll('.currentTab .content li');
            const myTasks = Array.from(tasks);

            // filter tasks
            let filteredTasks = myTasks.filter(task => {
                // get text
                let text = task.querySelector('.textCon').textContent.toLowerCase();

                return text.includes(value);
            });

            // show/hide tasks
            if (filteredTasks.length > 0) {
                //! hide all tasks
                myTasks.forEach(elm => elm.style.display = 'none');
                //* show matched tasks
                filteredTasks.forEach(elm => elm.style.display = 'grid');
            } else {
                //* show all tasks
                myTasks.forEach(elm => elm.style.display = 'grid');
            }

        });

    }

}

//? handle storage
class Store {

    constructor(tab, id, text) {
        this.tab = tab;
        this.id = id;
        this.text = text;
    }

    // get tasks
    static getTask() {
        let arr;
        if (localStorage.getItem('tasks') === null) { // if local storage is empty
            arr = [];
        } else { // if local storage is full
            arr = JSON.parse(localStorage.getItem('tasks'));
        }
        return arr;
    }

    // add task
    static addTask(li) {
        // update arr from localStorage
        let arr = Store.getTask();

        // select task 
        const task = li.querySelector('.textCon');
        // get attribute value
        function attr(attr) {
            return task.getAttribute(`data-${attr}`);
        }
        // init task object
        const myTask = new Store(attr('tab'), attr('id'), task.innerHTML);

        //* push objects to array
        arr.push(myTask);
        //! store tasks to localStorage
        localStorage.setItem('tasks', JSON.stringify(arr));

    }

    // remove task
    static removeTask(id) {
        // update arr from localStorage
        let arr = Store.getTask();

        // loop for deleting desired tasks
        arr.forEach((task, index) => {
            if (task.id == id) {
                arr.splice(index, 1);
            }
        });

        //! store tasks to localStorage
        localStorage.setItem('tasks', JSON.stringify(arr));
    }

    // edit task
    static editTask(id, text) {
        // update arr from localStorage
        let arr = Store.getTask();

        // loop for deleting desired tasks
        arr.forEach(task => {
            if (task.id == id) {
                task.text = text;
            }
        });

        //! store tasks to localStorage
        localStorage.setItem('tasks', JSON.stringify(arr));
    }

    // remove tab
    static removeTab(tab) {
        // update arr from localStorage
        let arr = Store.getTask();
        // select all tasks 
        const tasks = tab.querySelectorAll('.content .textCon');

        // loop through all tasks of current tab
        tasks.forEach(ts => {
            // loop for deleting desired tasks
            arr.forEach((task, index) => {
                if (task.id == ts.getAttribute('data-id')) {
                    arr.splice(index, 1);
                }
            });
        });

        //! store tasks to localStorage
        localStorage.setItem('tasks', JSON.stringify(arr));
    }

    // get taks from localStorage
    static loadTasks() {
        // select tabs slider
        const slider = document.getElementById('tabsSlider');
        // select add btn
        const addBtn = document.getElementById('addNewTab');

        const regex = /&nbsp;|[\n\r]|\u21b5|↵/g; // for detecting space and line break

        //* get tasks from localStorage
        let arr = Store.getTask();

        // get all tabs' titles
        const tabs = arr.map(item => {
            return item.tab;
        });

        // remove dublicated tabs
        const netTabs = [...new Set(tabs)];

        // loop through tabs
        for (let i of netTabs) {

            // filter tasks based on each tab
            let filteredTasks = arr.filter(elm => {
                return elm.tab === i;
            });

            // define a tasksHolder
            let tasksHolder = "";
            // looping through filteredTasks
            filteredTasks.forEach(elm => {
                //* append to tasksHolder
                tasksHolder += `
                                        <li>
                                            <span class="editCon">
                                                <img src="img/edit-pen.svg" class="editNote" alt="edit-pen">
                                            </span>
                                            <span class="selectCon">
                                                <label>
                                                    <input class="selectItem" type="checkbox">
                                                    <span class="check"></span>
                                                </label>
                                            </span>
                                            <span class="textCon" data-id="${elm.id}" data-tab="${elm.tab}">${elm.text.replace(regex,"<br>")}</span>
                                        </li>
                                        `;
            });

            // create div
            const div = document.createElement('div');
            // add class
            div.className = 'tab';
            // append to div
            div.innerHTML = `
                                <span class="tasksNum">(${filteredTasks.length})</span>
                                <input class="noteTitle" type="text" value="${i}" placeholder="New Note" readonly>
                                <button class="xBtn" type="button">
                                    <i class="clickXBtn"></i>
                                    <span class="clickXBtn"></span>
                                    <span class="clickXBtn"></span>
                                </button>
                                <div class="content">
                                    <ul>${tasksHolder}</ul>
                                </div>
                                `;

            // apppend div to tab container
            slider.insertBefore(div, addBtn);

            //* activate 1st tab
            const tab = document.querySelector('.tab');
            tab.classList.add('currentTab');

        }

    }

}

// init global
Nav.global();
Header.global();
Tabs.global();
UI.global();

// !EVENTS
//* Nav
// click event for modeSwitcher
Nav.modeCon.addEventListener('click', Nav.modeSwitcher, true);

//* Tabs
// click event for tabSwichter
Tabs.slider.addEventListener('click', Tabs.tabSwichter, true);
//  click event for tabs navigation
Tabs.btnsCon.addEventListener('click', Tabs.navigateTabs, true);

//* UI
// show settings layer 
UI.settingsBtn.addEventListener('click', () => UI.settingsLayer.style.display = "block");
// hide settings layer 
UI.settingsCloseBtn.addEventListener('click', () => UI.settingsLayer.style.display = "none");
// backup/update data 
UI.settingsLayer.addEventListener('click', UI.syncData);
// click add note button
UI.addNoteBtnCon.addEventListener('click', UI.showTextarea, true);
// click save task
UI.saveBtn.addEventListener('click', () => UI.addTask().catch(err => console.log(err)), true);
// click remove task
UI.delBtnCon.addEventListener('click', (e) => UI.removeTask(e), true);
// click edit btn
UI.slider.addEventListener('click', e => UI.editTask(e), true);
// click add/remove tab
UI.slider.addEventListener('click', e => {
    // init add new tab fn
    UI.addNewTab(e);
    // init remove tab fn
    UI.removeTab(e);
}, true);
// click select all
UI.all.addEventListener('click', UI.selectAll, true);
// dbclick to rename tab
UI.slider.addEventListener('click', UI.renameTab, true);
// blur to disable renaming tab
UI.slider.addEventListener('blur', UI.disableRename, true);


//* DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    // sync date
    Header.syncDate();
    // sync date each minute
    setInterval(() => {
        Header.syncDate();
    }, 1 * 60 * 1000);
    // init tab btn animation
    UI.animateTabBtn();
    // init hide textarea
    UI.hideTextarea();
    // display tasks
    Store.loadTasks();
    // update note title
    Tabs.noteTitle();
    // init engine
    UI.engine();
    // init scroll slider mouse/touch
    Tabs.navSliderByMouse();
    Tabs.navSliderByTouch();
});