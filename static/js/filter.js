var CoursesFilter = function(input, courses) {
    this.searchInput = input;
    this.coursesList = courses;
    // Index of selected element
    this.selected = null;
    this.filterList = [];

    // Process course list for data
    this.courses = [];
    for(var i = this.coursesList.length - 1; i >= 0; i--) {
        var course = this.coursesList[i];
        this.courses.push({
            'element': course,
            'text': course.dataset.text
        });
    }

    // Listen for input change
    this.searchInput.addEventListener('input', this.search.bind(this));
    // Keyboard shortcuts
    document.addEventListener('keydown', this.shortcuts.bind(this));
};

CoursesFilter.prototype.max = function() {
    if(this.filterList.length > 0) {
        return this.filterList.length - 1;
    }
    return null;
};

CoursesFilter.prototype.search = function(e) {
    this.selected = null;
    if(this.searchInput.value === '') {
        // Input empty, show all elements
        this.show();
    }
    else {
        // Show only elements matching
        this.hide();
        this.filterList = this.filter(this.searchInput.value);
        if(this.filterList.length > 0) {
            // When searching always set selected element to the first
            this.selected = 0;
            this.select();
            for (var i = 0; i < this.filterList.length; i++) {
                this.filterList[i].element.style.display = '';
                this.filterList[i].element.parentNode.appendChild(this.filterList[i].element);
            }
        }
    }
};

CoursesFilter.prototype.show = function() {
    for(var i = 0; i < this.coursesList.length; i++) {
        this.coursesList[i].style.display = '';
    }
};

CoursesFilter.prototype.hide = function() {
    for(var i = 0; i < this.coursesList.length; i++) {
        this.coursesList[i].style.display = 'none';
    }
};

CoursesFilter.prototype.filter = function(word) {
    return this.courses.filter(function(value, i, array) {
        // case insensitive contains check
        value.score = value.text.toLowerCase().indexOf(word.toLowerCase());
        // -1: not found
        return value.score !== -1;
    }.bind(this)).sort(function(a, b) {
        // Lower index = better
        return a.score - b.score;
    });
};

CoursesFilter.prototype.select = function() {
    // Mark selected element as selected
    for (var i = this.filterList.length - 1; i >= 0; i--) {
        var element = this.filterList[i].element;
        element.classList.remove('selected');
    }
    element = this.filterList[this.selected].element;
    element.classList.add('selected');
};

CoursesFilter.prototype.shortcuts = function(e) {
    if(e.altKey || e.ctrlKey || e.shiftKey) {
        // Ignore any events with modifiers to prevent overlapping with browser shortcuts
        return;
    }
    if(this.selected !== null) {
        // Previous
        if(e.keyCode == 37) {
            if(this.selected > 0) {
                this.selected--;
                this.select();
            }
        }
        // Next
        if(e.keyCode == 39) {
            if(this.selected < this.max()) {
                this.selected++;
                this.select();
            }
        }
        // Select
        if(e.keyCode == 13 || e.keyCode == 32) {
            var element = this.filterList[this.selected].element;
            window.location.href = element.getElementsByTagName('a')[0].href;
        }
    }
};