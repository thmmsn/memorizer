(function () {
    var mobileWidth = 800;
    /**
     * Answer questions with keystrokes
     * - Select alternative: 1, 2, 3 or 4
     * - Answer: {spacebar}
     * - Next/Previous question: Arrow right/left
     */
    document.addEventListener('keydown', function(e) {
        // Select an alternative
        try {
            var alternative = e.keyCode - 49;
            document.querySelectorAll('[name="answer"]')[alternative].checked = true;
        } catch (error) {
            // Not a valid alternative
        }

        // Submit answer to current question
        if (e.keyCode == 32 || e.keyCode == 81) {
            document.querySelector('form').submit();
        }

        // Previous question
        if (e.keyCode == 37 || e.keyCode == 65) {
            var prev = document.getElementById('prev');
            if (prev !== null) {
                window.location = prev.href;
            }
        }

        // Next question
        if (e.keyCode == 39 || e.keyCode == 68) {
            var next = document.getElementById('next');
            if (next !== null) {
                window.location = next.href;
            }
        }

        // Random question
        if (e.keyCode == 82) {
            var random = document.getElementById('random');
            if (random !== null) {
                window.location = random.href;
            }
        }
    });
    var navSidebar = document.querySelector('nav.sidebar');
    var navTop = document.querySelector('nav.top');
    var icon = navTop.querySelector('.logo i');
    var toggleSidebar = function() {
        var closed = navSidebar.className.indexOf('closed') > -1;
        if(!closed) {
            navSidebar.className += ' closed';
            icon.className = icon.className.replace('fa-times', 'fa-navicon');
        }
        else {
            navSidebar.className = navSidebar.className.replace(' closed', '');
            icon.className = icon.className.replace('fa-navicon', 'fa-times');
        }
    }
    icon.addEventListener('click', toggleSidebar);
})();
