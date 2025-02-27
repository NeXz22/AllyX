document.addEventListener('DOMContentLoaded', function() {
    // Enhance the accessibility of the details/summary elements
    const detailsElements = document.querySelectorAll('.wcag-details');
    
    detailsElements.forEach(details => {
        const summary = details.querySelector('summary');
        
        // Add ARIA attributes to improve screen reader experience
        summary.setAttribute('aria-expanded', 'false');
        summary.setAttribute('role', 'button');
        
        details.addEventListener('toggle', () => {
            const isOpen = details.hasAttribute('open');
            summary.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    });
    
    // Add keyboard support for the demo button
    const demoButton = document.querySelector('.demo-button');
    
    demoButton.addEventListener('click', function() {
        // Provide feedback when button is clicked
        const feedbackMessage = document.createElement('div');
        feedbackMessage.textContent = 'Button clicked!';
        feedbackMessage.setAttribute('role', 'status');
        feedbackMessage.setAttribute('aria-live', 'polite');
        feedbackMessage.style.marginTop = '10px';
        feedbackMessage.style.color = '#0056b3';
        
        const example = document.querySelector('.example');
        
        // Remove previous message if exists
        const existingMessage = example.querySelector('[role="status"]');
        if (existingMessage) {
            example.removeChild(existingMessage);
        }
        
        example.appendChild(feedbackMessage);
        
        // Remove the message after 3 seconds
        setTimeout(() => {
            if (feedbackMessage.parentNode === example) {
                example.removeChild(feedbackMessage);
            }
        }, 3000);
    });
    
    // Add validation for the text input
    const demoInput = document.querySelector('.demo-input');
    
    if (demoInput) {
        demoInput.addEventListener('blur', function() {
            validateInput(demoInput);
        });
        
        demoInput.addEventListener('input', function() {
            // If there was an error and user starts typing, remove error
            if (demoInput.classList.contains('error')) {
                removeError(demoInput);
            }
        });
    }
    
    function validateInput(input) {
        const value = input.value.trim();
        const formGroup = input.closest('.form-group');
        
        // Simple validation - check if input is empty
        if (value === '') {
            showError(input, 'This field is required');
        } else if (value.length < 3) {
            showError(input, 'Please enter at least 3 characters');
        } else {
            removeError(input);
        }
    }
    
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        
        // Remove any existing error message
        removeError(input);
        
        // Add error class to input
        input.classList.add('error');
        
        // Create error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.id = 'input-error';
        errorElement.setAttribute('role', 'alert');
        
        // Add error message after help text
        formGroup.appendChild(errorElement);
        
        // Update aria attributes
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', 
            (input.getAttribute('aria-describedby') || '') + ' input-error');
    }
    
    function removeError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            formGroup.removeChild(errorElement);
        }
        
        input.classList.remove('error');
        input.setAttribute('aria-invalid', 'false');
        
        // Reset aria-describedby to original help text
        const helpTextId = input.getAttribute('aria-describedby').replace(' input-error', '');
        input.setAttribute('aria-describedby', helpTextId);
    }

    // Add keyboard enhancement for checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        // Add event listener to announce changes to screen readers
        checkbox.addEventListener('change', function() {
            const label = document.querySelector(`label[for="${this.id}"]`);
            const status = this.checked ? 'checked' : 'unchecked';
            
            // Create a visually hidden element for screen reader announcement
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = `${label.textContent} ${status}`;
            
            document.body.appendChild(announcement);
            
            // Remove the announcement after it's been read
            setTimeout(() => {
                if (announcement.parentNode) {
                    document.body.removeChild(announcement);
                }
            }, 1000);
        });
    });

    // Add a helper class for screen reader only content
    const style = document.createElement('style');
    style.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
        }
    `;
    document.head.appendChild(style);

    // Native select enhancement
    const nativeSelect = document.getElementById('native-select');
    if (nativeSelect) {
        nativeSelect.addEventListener('change', function() {
            // Announce selection to screen readers
            const selectedOption = this.options[this.selectedIndex];
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = `Selected: ${selectedOption.textContent}`;
            
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                if (announcement.parentNode) {
                    document.body.removeChild(announcement);
                }
            }, 1000);
        });
    }

    // Custom select implementation
    const customSelectButton = document.getElementById('custom-select-button');
    const customSelectListbox = document.getElementById('custom-select-listbox');
    const customSelectOptions = customSelectListbox.querySelectorAll('[role="option"]');

    if (customSelectButton && customSelectListbox) {
        // Toggle dropdown
        customSelectButton.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            toggleDropdown(!expanded);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!customSelectButton.contains(e.target) && !customSelectListbox.contains(e.target)) {
                toggleDropdown(false);
            }
        });
        
        // Handle keyboard navigation
        customSelectButton.addEventListener('keydown', function(e) {
            switch (e.key) {
                case 'ArrowDown':
                case 'Down':
                    e.preventDefault();
                    toggleDropdown(true);
                    customSelectOptions[0].focus();
                    break;
                case 'Escape':
                case 'Esc':
                    toggleDropdown(false);
                    break;
            }
        });
        
        customSelectListbox.addEventListener('keydown', function(e) {
            const focusedOption = document.activeElement;
            const focusedIndex = Array.from(customSelectOptions).indexOf(focusedOption);
            
            switch (e.key) {
                case 'ArrowUp':
                case 'Up':
                    e.preventDefault();
                    if (focusedIndex > 0) {
                        customSelectOptions[focusedIndex - 1].focus();
                    }
                    break;
                case 'ArrowDown':
                case 'Down':
                    e.preventDefault();
                    if (focusedIndex < customSelectOptions.length - 1) {
                        customSelectOptions[focusedIndex + 1].focus();
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    customSelectOptions[0].focus();
                    break;
                case 'End':
                    e.preventDefault();
                    customSelectOptions[customSelectOptions.length - 1].focus();
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    selectOption(focusedOption);
                    break;
                case 'Escape':
                case 'Esc':
                    e.preventDefault();
                    toggleDropdown(false);
                    customSelectButton.focus();
                    break;
            }
        });
        
        // Make options focusable and clickable
        customSelectOptions.forEach(option => {
            option.setAttribute('tabindex', '-1');
            
            option.addEventListener('click', function() {
                selectOption(this);
            });
        });
        
        function toggleDropdown(open) {
            customSelectButton.setAttribute('aria-expanded', open);
            if (open) {
                customSelectListbox.classList.add('show');
                
                // Set initial selection
                const selectedOption = customSelectListbox.querySelector('[aria-selected="true"]');
                if (selectedOption) {
                    selectedOption.focus();
                }
            } else {
                customSelectListbox.classList.remove('show');
            }
        }
        
        function selectOption(option) {
            // Update selected state
            customSelectOptions.forEach(opt => {
                opt.setAttribute('aria-selected', 'false');
            });
            option.setAttribute('aria-selected', 'true');
            
            // Update button text
            customSelectButton.textContent = option.textContent;
            
            // Close dropdown
            toggleDropdown(false);
            customSelectButton.focus();
            
            // Announce selection to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = `Selected: ${option.textContent}`;
            
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                if (announcement.parentNode) {
                    document.body.removeChild(announcement);
                }
            }, 1000);
        }
    }

    // Add keyboard support for the icon buttons
    const iconButtons = document.querySelectorAll('.icon-button');

    iconButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the button's accessible name
            const buttonName = this.getAttribute('aria-label');
            
            // Provide feedback when button is clicked
            const feedbackMessage = document.createElement('div');
            feedbackMessage.textContent = `${buttonName} button clicked!`;
            feedbackMessage.setAttribute('role', 'status');
            feedbackMessage.setAttribute('aria-live', 'polite');
            feedbackMessage.style.marginTop = '10px';
            feedbackMessage.style.color = '#0056b3';
            
            const example = document.querySelector('.example');
            
            // Remove previous message if exists
            const existingMessage = example.querySelector('[role="status"]');
            if (existingMessage) {
                example.removeChild(existingMessage);
            }
            
            example.appendChild(feedbackMessage);
            
            // Remove the message after 3 seconds
            setTimeout(() => {
                if (feedbackMessage.parentNode === example) {
                    example.removeChild(feedbackMessage);
                }
            }, 3000);
        });
    });

    // Progress bar functionality
    const progressBar = document.querySelector('#progress-control');
    const progressBarFill = progressBar?.querySelector('.progress-bar');
    const progressText = progressBar?.nextElementSibling;
    const progressButtons = document.querySelectorAll('.progress-button');

    if (progressBar && progressBarFill && progressText && progressButtons.length) {
        // Initialize progress value
        let progressValue = parseInt(progressBar.getAttribute('aria-valuenow'), 10);
        
        // Update progress bar function
        function updateProgress(newValue) {
            // Ensure value is within bounds
            newValue = Math.max(0, Math.min(100, newValue));
            
            // Update the progress bar width
            progressBarFill.style.width = `${newValue}%`;
            
            // Update the text
            progressText.textContent = `${newValue}%`;
            
            // Update ARIA attributes
            progressBar.setAttribute('aria-valuenow', newValue);
            
            // Store the current value
            progressValue = newValue;
            
            // Announce progress to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = `Progress: ${newValue} percent`;
            
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                if (announcement.parentNode) {
                    document.body.removeChild(announcement);
                }
            }, 1000);
        }
        
        // Add event listeners to buttons
        progressButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.dataset.action;
                
                if (action === 'increase') {
                    updateProgress(progressValue + 10);
                } else if (action === 'decrease') {
                    updateProgress(progressValue - 10);
                }
            });
        });
    }

    // Add keyboard enhancement for radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');

    radioButtons.forEach(radio => {
        // Add event listener to announce changes to screen readers
        radio.addEventListener('change', function() {
            if (this.checked) {
                const label = document.querySelector(`label[for="${this.id}"]`);
                
                // Create a visually hidden element for screen reader announcement
                const announcement = document.createElement('div');
                announcement.setAttribute('role', 'status');
                announcement.setAttribute('aria-live', 'polite');
                announcement.className = 'sr-only';
                announcement.textContent = `Selected: ${label.textContent}`;
                
                document.body.appendChild(announcement);
                
                // Remove the announcement after it's been read
                setTimeout(() => {
                    if (announcement.parentNode) {
                        document.body.removeChild(announcement);
                    }
                }, 1000);
            }
        });
    });

    // Table functionality
    const dataTable = document.querySelector('.data-table');
    const sortPriceBtn = document.getElementById('sort-price');
    const sortRatingBtn = document.getElementById('sort-rating');
    const filterAvailableBtn = document.getElementById('filter-available');
    const resetTableBtn = document.getElementById('reset-table');

    if (dataTable && sortPriceBtn && sortRatingBtn && filterAvailableBtn && resetTableBtn) {
        // Store original table data for reset
        const originalTableHTML = dataTable.querySelector('tbody').innerHTML;
        
        // Sort by price
        sortPriceBtn.addEventListener('click', function() {
            sortTable(1, 'price');
            announceTableChange('Table sorted by price');
        });
        
        // Sort by rating
        sortRatingBtn.addEventListener('click', function() {
            sortTable(3, 'rating');
            announceTableChange('Table sorted by rating');
        });
        
        // Filter to show only available items
        filterAvailableBtn.addEventListener('click', function() {
            const isActive = this.classList.toggle('active');
            
            if (isActive) {
                filterTable();
                announceTableChange('Table filtered to show only available products');
            } else {
                resetTable();
                announceTableChange('Filter removed');
            }
        });
        
        // Reset table
        resetTableBtn.addEventListener('click', function() {
            resetTable();
            
            // Remove active class from filter button
            filterAvailableBtn.classList.remove('active');
            
            announceTableChange('Table reset to original order');
        });
        
        // Sort table function
        function sortTable(columnIndex, type) {
            const tbody = dataTable.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            // Sort the rows
            rows.sort((a, b) => {
                const aValue = a.cells[columnIndex].textContent.trim();
                const bValue = b.cells[columnIndex].textContent.trim();
                
                if (type === 'price') {
                    // Extract numeric value from price string (remove $ and convert to number)
                    const aPrice = parseFloat(aValue.replace('$', ''));
                    const bPrice = parseFloat(bValue.replace('$', ''));
                    return aPrice - bPrice;
                } else if (type === 'rating') {
                    // Extract numeric value from rating string
                    const aRating = parseFloat(aValue);
                    const bRating = parseFloat(bValue);
                    return bRating - aRating; // Sort ratings in descending order
                }
                
                // Default string comparison
                return aValue.localeCompare(bValue);
            });
            
            // Remove existing rows
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
            
            // Add sorted rows
            rows.forEach(row => tbody.appendChild(row));
        }
        
        // Filter table to show only available items
        function filterTable() {
            const tbody = dataTable.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            rows.forEach(row => {
                const availabilityCell = row.cells[4];
                const availability = availabilityCell.textContent.trim().toLowerCase();
                
                if (availability === 'out of stock') {
                    row.style.display = 'none';
                    row.setAttribute('aria-hidden', 'true');
                }
            });
        }
        
        // Reset table to original state
        function resetTable() {
            const tbody = dataTable.querySelector('tbody');
            tbody.innerHTML = originalTableHTML;
            
            // Make sure all rows are visible
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                row.style.display = '';
                row.removeAttribute('aria-hidden');
            });
        }
        
        // Announce table changes to screen readers
        function announceTableChange(message) {
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = message;
            
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                if (announcement.parentNode) {
                    document.body.removeChild(announcement);
                }
            }, 1000);
        }
    }

    // Tabs functionality
    const tabList = document.querySelector('[role="tablist"]');
    const tabs = document.querySelectorAll('[role="tab"]');
    const tabPanels = document.querySelectorAll('[role="tabpanel"]');

    if (tabList && tabs.length && tabPanels.length) {
        // Add keyboard navigation for tabs
        tabList.addEventListener('keydown', function(e) {
            // Get the index of the current tab
            const currentTab = document.activeElement;
            const currentIndex = Array.from(tabs).indexOf(currentTab);
            
            // Define keys that will be used
            const leftKey = 37;
            const rightKey = 39;
            const homeKey = 36;
            const endKey = 35;
            
            let nextIndex;
            
            // Handle arrow keys, home, and end
            switch (e.keyCode) {
                case rightKey:
                    nextIndex = currentIndex + 1;
                    if (nextIndex >= tabs.length) {
                        nextIndex = 0; // Wrap around to the first tab
                    }
                    activateTab(tabs[nextIndex]);
                    e.preventDefault();
                    break;
                    
                case leftKey:
                    nextIndex = currentIndex - 1;
                    if (nextIndex < 0) {
                        nextIndex = tabs.length - 1; // Wrap around to the last tab
                    }
                    activateTab(tabs[nextIndex]);
                    e.preventDefault();
                    break;
                    
                case homeKey:
                    activateTab(tabs[0]); // First tab
                    e.preventDefault();
                    break;
                    
                case endKey:
                    activateTab(tabs[tabs.length - 1]); // Last tab
                    e.preventDefault();
                    break;
            }
        });
        
        // Add click event for each tab
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                activateTab(this);
            });
        });
        
        // Function to activate a tab
        function activateTab(tab) {
            // Deactivate all tabs
            tabs.forEach(t => {
                t.setAttribute('aria-selected', 'false');
                t.setAttribute('tabindex', '-1');
            });
            
            // Hide all tab panels
            tabPanels.forEach(panel => {
                panel.setAttribute('hidden', '');
            });
            
            // Activate the selected tab
            tab.setAttribute('aria-selected', 'true');
            tab.setAttribute('tabindex', '0');
            tab.focus();
            
            // Show the associated panel
            const panelId = tab.getAttribute('aria-controls');
            const panel = document.getElementById(panelId);
            panel.removeAttribute('hidden');
            
            // Announce tab change to screen readers
            announceTabChange(tab.textContent.trim());
        }
        
        // Announce tab changes to screen readers
        function announceTabChange(tabName) {
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = `Tab ${tabName} activated`;
            
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                if (announcement.parentNode) {
                    document.body.removeChild(announcement);
                }
            }, 1000);
        }
    }

    // Switch functionality
    const switches = document.querySelectorAll('[role="switch"]');

    switches.forEach(switchEl => {
        // Add click event
        switchEl.addEventListener('click', function() {
            if (this.disabled) return;
            
            const isChecked = this.getAttribute('aria-checked') === 'true';
            const newState = !isChecked;
            
            // Update the switch state
            this.setAttribute('aria-checked', newState);
            
            // Get the label text
            const labelId = this.getAttribute('aria-labelledby');
            const label = document.getElementById(labelId);
            
            // Announce the state change to screen readers
            announceStateChange(label.textContent, newState);
            
            // Apply the setting (in a real app, this would save the preference)
            applySetting(this.id, newState);
        });
        
        // Add keyboard support
        switchEl.addEventListener('keydown', function(e) {
            if (this.disabled) return;
            
            // Toggle with Space or Enter
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Function to announce state changes to screen readers
    function announceStateChange(setting, state) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.className = 'sr-only';
        announcement.textContent = `${setting} ${state ? 'enabled' : 'disabled'}`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    // Function to apply the setting (demo functionality)
    function applySetting(id, state) {
        // In a real application, this would save the user preference
        console.log(`Setting ${id} is now ${state ? 'enabled' : 'disabled'}`);
        
        // Demo functionality for dark mode toggle
        if (id === 'darkmode-switch') {
            if (state) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    }

    // Slider functionality
    const sliders = document.querySelectorAll('.slider-input');
    const zoomIncreaseBtn = document.getElementById('zoom-increase');
    const zoomDecreaseBtn = document.getElementById('zoom-decrease');

    sliders.forEach(slider => {
        const valueDisplay = slider.closest('.slider-controls').querySelector('.slider-value');
        
        // Update value display and ARIA attributes on input
        slider.addEventListener('input', function() {
            updateSliderValue(this, valueDisplay);
        });
        
        // Announce value when slider stops
        slider.addEventListener('change', function() {
            announceSliderValue(this);
        });
        
        // Initialize the value display
        updateSliderValue(slider, valueDisplay);
    });

    // Add functionality to zoom buttons
    if (zoomIncreaseBtn && zoomDecreaseBtn) {
        const zoomSlider = document.getElementById('zoom-slider');
        
        zoomIncreaseBtn.addEventListener('click', function() {
            incrementSlider(zoomSlider, 10);
        });
        
        zoomDecreaseBtn.addEventListener('click', function() {
            incrementSlider(zoomSlider, -10);
        });
    }

    // Function to update slider value display
    function updateSliderValue(slider, valueDisplay) {
        const value = slider.value;
        const id = slider.id;
        let displayText;
        
        // Format the display text based on the slider
        switch (id) {
            case 'temperature-slider':
                displayText = `${value}°C`;
                slider.setAttribute('aria-valuetext', `${value} degrees Celsius`);
                break;
            case 'zoom-slider':
                displayText = `${value}%`;
                slider.setAttribute('aria-valuetext', `${value} percent`);
                break;
            default:
                displayText = `${value}%`;
                slider.setAttribute('aria-valuetext', `${value} percent`);
        }
        
        // Update the value display
        valueDisplay.textContent = displayText;
        
        // Update ARIA attributes
        slider.setAttribute('aria-valuenow', value);
    }

    // Function to announce slider value to screen readers
    function announceSliderValue(slider) {
        const label = document.querySelector(`label[for="${slider.id}"]`);
        const valueText = slider.getAttribute('aria-valuetext');
        
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `${label.textContent}: ${valueText}`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    // Function to increment/decrement slider value
    function incrementSlider(slider, amount) {
        const currentValue = parseInt(slider.value, 10);
        const step = parseInt(slider.getAttribute('step') || 1, 10);
        const min = parseInt(slider.getAttribute('min'), 10);
        const max = parseInt(slider.getAttribute('max'), 10);
        
        // Calculate new value
        let newValue = currentValue + amount;
        
        // Ensure the new value is within bounds
        newValue = Math.max(min, Math.min(max, newValue));
        
        // Update the slider value
        slider.value = newValue;
        
        // Trigger the input event to update displays
        const event = new Event('input', { bubbles: true });
        slider.dispatchEvent(event);
        
        // Announce the change
        announceSliderValue(slider);
    }

    // Avatar functionality
    const avatarButtons = document.querySelectorAll('.avatar-button');

    avatarButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the user name from the sibling avatar-info element
            const avatarItem = this.closest('.avatar-item');
            const userName = avatarItem.querySelector('.avatar-name').textContent;
            
            // Create a modal or notification (simplified for demo)
            const notification = document.createElement('div');
            notification.className = 'avatar-notification';
            notification.setAttribute('role', 'status');
            notification.setAttribute('aria-live', 'polite');
            notification.textContent = `Viewing profile for ${userName}`;
            
            // Add to the document
            document.body.appendChild(notification);
            
            // Remove after a delay
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 3000);
            
            // In a real application, this would open a profile modal or navigate to a profile page
            console.log(`Viewing profile for ${userName}`);
        });
    });

    // Add keyboard navigation for avatar stack
    const avatarStack = document.querySelector('.avatar-stack');

    if (avatarStack) {
        avatarStack.setAttribute('tabindex', '0');
        avatarStack.setAttribute('role', 'button');
        
        avatarStack.addEventListener('click', function() {
            showTeamMembers(this);
        });
        
        avatarStack.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showTeamMembers(this);
            }
        });
    }

    // Function to show team members (simplified for demo)
    function showTeamMembers(stackElement) {
        const teamName = stackElement.closest('.avatar-item').querySelector('.avatar-name').textContent;
        
        const notification = document.createElement('div');
        notification.className = 'avatar-notification';
        notification.setAttribute('role', 'status');
        notification.setAttribute('aria-live', 'polite');
        notification.textContent = `Viewing all members of ${teamName}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 3000);
        
        // In a real application, this would show a list of all team members
        console.log(`Showing all members of ${teamName}`);
    }

    // Dialog functionality
    const openDialogBtn = document.getElementById('open-dialog');
    const openAlertDialogBtn = document.getElementById('open-alert-dialog');
    const standardDialog = document.getElementById('standard-dialog');
    const alertDialog = document.getElementById('alert-dialog');

    // Standard dialog controls
    const dialogCloseBtn = standardDialog.querySelector('.dialog-close');
    const dialogCancelBtn = document.getElementById('dialog-cancel');
    const dialogSaveBtn = document.getElementById('dialog-save');

    // Alert dialog controls
    const alertCancelBtn = document.getElementById('alert-cancel');
    const alertConfirmBtn = document.getElementById('alert-confirm');

    // Open standard dialog
    if (openDialogBtn && standardDialog) {
        openDialogBtn.addEventListener('click', function() {
            openDialog(standardDialog, this);
        });
    }

    // Open alert dialog
    if (openAlertDialogBtn && alertDialog) {
        openAlertDialogBtn.addEventListener('click', function() {
            openDialog(alertDialog, this, alertConfirmBtn);
        });
    }

    // Close standard dialog
    if (dialogCloseBtn && dialogCancelBtn && dialogSaveBtn) {
        dialogCloseBtn.addEventListener('click', function() {
            closeDialog(standardDialog);
        });
        
        dialogCancelBtn.addEventListener('click', function() {
            closeDialog(standardDialog);
        });
        
        dialogSaveBtn.addEventListener('click', function() {
            // In a real app, this would save the form data
            console.log('Saving changes...');
            closeDialog(standardDialog);
        });
    }

    // Close alert dialog
    if (alertCancelBtn && alertConfirmBtn) {
        alertCancelBtn.addEventListener('click', function() {
            closeDialog(alertDialog);
        });
        
        alertConfirmBtn.addEventListener('click', function() {
            // In a real app, this would perform the deletion
            console.log('Deleting item...');
            closeDialog(alertDialog);
        });
    }

    // Function to open a dialog
    function openDialog(dialogEl, triggerEl, initialFocusEl = null) {
        // Store the element that had focus before opening the dialog
        dialogEl.previouslyFocused = document.activeElement;
        
        // Show the dialog
        dialogEl.setAttribute('aria-hidden', 'false');
        
        // Get all focusable elements in the dialog
        const focusableEls = dialogEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        dialogEl.firstFocusable = focusableEls[0];
        dialogEl.lastFocusable = focusableEls[focusableEls.length - 1];
        
        // Set focus on the first focusable element or a specified element
        if (initialFocusEl) {
            initialFocusEl.focus();
        } else if (dialogEl.firstFocusable) {
            dialogEl.firstFocusable.focus();
        }
        
        // Add event listeners for keyboard navigation
        document.addEventListener('keydown', handleDialogKeydown);
        
        // Prevent scrolling of the background
        document.body.style.overflow = 'hidden';
        
        // Announce dialog opening to screen readers
        announceDialog(dialogEl);
    }

    // Function to close a dialog
    function closeDialog(dialogEl) {
        // Hide the dialog
        dialogEl.setAttribute('aria-hidden', 'true');
        
        // Remove event listeners
        document.removeEventListener('keydown', handleDialogKeydown);
        
        // Restore scrolling
        document.body.style.overflow = '';
        
        // Return focus to the element that had focus before opening the dialog
        if (dialogEl.previouslyFocused) {
            dialogEl.previouslyFocused.focus();
        }
    }

    // Function to handle keyboard navigation within the dialog
    function handleDialogKeydown(e) {
        const activeDialog = document.querySelector('.dialog-overlay[aria-hidden="false"]');
        if (!activeDialog) return;
        
        // Close on Escape key
        if (e.key === 'Escape') {
            closeDialog(activeDialog);
            e.preventDefault();
            return;
        }
        
        // Trap focus within the dialog
        if (e.key === 'Tab') {
            // If Shift+Tab on first focusable element, wrap to last
            if (e.shiftKey && document.activeElement === activeDialog.firstFocusable) {
                activeDialog.lastFocusable.focus();
                e.preventDefault();
            } 
            // If Tab on last focusable element, wrap to first
            else if (!e.shiftKey && document.activeElement === activeDialog.lastFocusable) {
                activeDialog.firstFocusable.focus();
                e.preventDefault();
            }
        }
    }

    // Function to announce dialog opening to screen readers
    function announceDialog(dialogEl) {
        const dialogRole = dialogEl.querySelector('[role="dialog"], [role="alertdialog"]');
        const dialogTitle = dialogEl.querySelector('[id$="title"]').textContent;
        
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.className = 'sr-only';
        
        if (dialogRole && dialogRole.getAttribute('role') === 'alertdialog') {
            announcement.textContent = `Alert: ${dialogTitle}. Press Escape to close.`;
        } else {
            announcement.textContent = `Dialog: ${dialogTitle}. Press Escape to close.`;
        }
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    // Tooltip functionality
    const tooltipTriggers = document.querySelectorAll('.tooltip-trigger');
    const tooltips = document.querySelectorAll('.tooltip');

    // Initialize tooltips
    tooltips.forEach(tooltip => {
        // Add tabindex to make tooltips focusable for keyboard users
        tooltip.setAttribute('tabindex', '0');
    });

    // Add event listeners to tooltip triggers
    tooltipTriggers.forEach(trigger => {
        // Handle keyboard events
        trigger.addEventListener('keydown', function(e) {
            // Show tooltip on Enter or Space
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const tooltipId = this.getAttribute('aria-describedby').split(' ')[0];
                const tooltip = document.getElementById(tooltipId);
                
                // Toggle tooltip visibility
                if (tooltip.classList.contains('tooltip-visible')) {
                    hideTooltip(tooltip);
                } else {
                    showTooltip(tooltip);
                }
            }
            
            // Hide tooltip on Escape
            if (e.key === 'Escape') {
                const tooltipId = this.getAttribute('aria-describedby').split(' ')[0];
                const tooltip = document.getElementById(tooltipId);
                hideTooltip(tooltip);
            }
        });
        
        // Handle focus events
        trigger.addEventListener('focus', function() {
            const tooltipId = this.getAttribute('aria-describedby').split(' ')[0];
            const tooltip = document.getElementById(tooltipId);
            showTooltip(tooltip);
        });
        
        trigger.addEventListener('blur', function() {
            const tooltipId = this.getAttribute('aria-describedby').split(' ')[0];
            const tooltip = document.getElementById(tooltipId);
            
            // Only hide if focus didn't move to the tooltip itself
            if (document.activeElement !== tooltip) {
                hideTooltip(tooltip);
            }
        });
    });

    // Add event listeners to tooltips themselves
    tooltips.forEach(tooltip => {
        // Hide tooltip when it loses focus
        tooltip.addEventListener('blur', function(e) {
            // Only hide if focus didn't move to the trigger
            const triggerId = this.id;
            const relatedTrigger = document.querySelector(`[aria-describedby*="${triggerId}"]`);
            
            if (document.activeElement !== relatedTrigger) {
                hideTooltip(this);
            }
        });
        
        // Hide tooltip on Escape
        tooltip.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                hideTooltip(this);
                
                // Return focus to the trigger
                const triggerId = this.id;
                const relatedTrigger = document.querySelector(`[aria-describedby*="${triggerId}"]`);
                if (relatedTrigger) {
                    relatedTrigger.focus();
                }
            }
        });
    });

    // Function to show tooltip
    function showTooltip(tooltip) {
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        tooltip.classList.add('tooltip-visible');
        
        // Position the tooltip to avoid overflow
        positionTooltip(tooltip);
    }

    // Function to hide tooltip
    function hideTooltip(tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        tooltip.classList.remove('tooltip-visible');
        
        // Reset position classes
        tooltip.classList.remove('position-bottom', 'position-left', 'position-right');
    }

    // Function to position tooltip based on available space
    function positionTooltip(tooltip) {
        // Get the trigger element
        const triggerId = tooltip.id;
        const trigger = document.querySelector(`[aria-describedby*="${triggerId}"]`);
        
        if (!trigger) return;
        
        // Get positions and dimensions
        const triggerRect = trigger.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Reset position classes
        tooltip.classList.remove('position-bottom', 'position-left', 'position-right');
        
        // Check if tooltip overflows top
        if (triggerRect.top < tooltipRect.height + 10) {
            tooltip.classList.add('position-bottom');
        }
        
        // After applying position-bottom, get updated dimensions
        const updatedTooltipRect = tooltip.getBoundingClientRect();
        
        // Check if tooltip overflows bottom after repositioning
        if (tooltip.classList.contains('position-bottom') && 
            triggerRect.bottom + updatedTooltipRect.height + 10 > viewportHeight) {
            
            tooltip.classList.remove('position-bottom');
            
            // Try left or right positioning instead
            if (triggerRect.left > updatedTooltipRect.width + 10) {
                tooltip.classList.add('position-left');
            } else if (viewportWidth - triggerRect.right > updatedTooltipRect.width + 10) {
                tooltip.classList.add('position-right');
            }
        }
    }

    // Reposition tooltips on window resize
    window.addEventListener('resize', function() {
        const visibleTooltips = document.querySelectorAll('.tooltip-visible');
        visibleTooltips.forEach(tooltip => {
            positionTooltip(tooltip);
        });
    });

    // Badge and Chip functionality
    const filterChips = document.querySelectorAll('.chip[role="checkbox"]');
    const chipRemoveButtons = document.querySelectorAll('.chip-remove');
    const chipInput = document.querySelector('.chip-input');
    const inputChipWrapper = document.querySelector('.input-chip-wrapper');

    // Handle filter chip selection
    filterChips.forEach(chip => {
        chip.addEventListener('click', function(e) {
            // Don't toggle if the click was on the remove button
            if (e.target.closest('.chip-remove')) return;
            
            toggleChip(this);
        });
        
        chip.addEventListener('keydown', function(e) {
            // Toggle with Space or Enter
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                toggleChip(this);
            }
        });
    });

    // Handle chip removal
    chipRemoveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent the chip click event
            const chip = this.closest('.chip');
            removeChip(chip);
        });
        
        button.addEventListener('keydown', function(e) {
            // Prevent space from toggling the parent chip
            if (e.key === ' ') {
                e.stopPropagation();
            }
        });
    });

    // Add new chips with the input field
    if (chipInput && inputChipWrapper) {
        chipInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                e.preventDefault();
                addChip(this.value.trim());
                this.value = '';
            }
        });
    }

    // Function to toggle chip selection
    function toggleChip(chip) {
        const isChecked = chip.getAttribute('aria-checked') === 'true';
        chip.setAttribute('aria-checked', !isChecked);
        
        // Announce the change to screen readers
        announceChipChange(chip, !isChecked);
    }

    // Function to remove a chip
    function removeChip(chip) {
        // Get the chip text for the announcement
        const chipText = chip.querySelector('.chip-text').textContent;
        
        // Remove the chip from the DOM
        chip.remove();
        
        // Announce the removal to screen readers
        announceChipRemoval(chipText);
    }

    // Function to add a new chip
    function addChip(text) {
        // Create the new chip
        const newChip = document.createElement('div');
        newChip.className = 'chip input-chip';
        newChip.setAttribute('role', 'button');
        newChip.setAttribute('tabindex', '-1');
        
        // Create the chip text
        const chipText = document.createElement('span');
        chipText.className = 'chip-text';
        chipText.textContent = text;
        
        // Create the remove button
        const removeButton = document.createElement('button');
        removeButton.className = 'chip-remove';
        removeButton.setAttribute('aria-label', `Remove ${text} tag`);
        
        // Create the remove icon
        const removeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        removeIcon.setAttribute('aria-hidden', 'true');
        removeIcon.setAttribute('viewBox', '0 0 24 24');
        removeIcon.setAttribute('width', '16');
        removeIcon.setAttribute('height', '16');
        
        const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        iconPath.setAttribute('d', 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z');
        
        removeIcon.appendChild(iconPath);
        removeButton.appendChild(removeIcon);
        
        // Add event listener to the remove button
        removeButton.addEventListener('click', function(e) {
            e.stopPropagation();
            removeChip(newChip);
        });
        
        // Assemble the chip
        newChip.appendChild(chipText);
        newChip.appendChild(removeButton);
        
        // Add the chip to the wrapper before the input
        inputChipWrapper.insertBefore(newChip, chipInput);
        
        // Announce the addition to screen readers
        announceChipAddition(text);
    }

    // Function to announce chip selection change
    function announceChipChange(chip, isSelected) {
        const chipText = chip.querySelector('.chip-text').textContent;
        
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `${chipText} filter ${isSelected ? 'selected' : 'unselected'}`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    // Function to announce chip removal
    function announceChipRemoval(chipText) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `${chipText} removed`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    // Function to announce chip addition
    function announceChipAddition(chipText) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `${chipText} added`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    // Header Menu/Navigation functionality
    const navMenuButtons = document.querySelectorAll('.nav-menu-button');
    const submenus = document.querySelectorAll('.submenu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileSubmenuToggles = document.querySelectorAll('.mobile-submenu-toggle');
    const mobileSubmenus = document.querySelectorAll('.mobile-submenu');

    // Desktop dropdown menu functionality
    if (navMenuButtons.length > 0) {
        navMenuButtons.forEach(button => {
            button.addEventListener('click', function() {
                const submenuId = this.getAttribute('aria-controls');
                const submenu = document.getElementById(submenuId);
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                // Close all other submenus
                navMenuButtons.forEach(otherButton => {
                    if (otherButton !== this) {
                        otherButton.setAttribute('aria-expanded', 'false');
                        const otherSubmenuId = otherButton.getAttribute('aria-controls');
                        const otherSubmenu = document.getElementById(otherSubmenuId);
                        otherSubmenu.classList.remove('show');
                    }
                });
                
                // Toggle current submenu
                this.setAttribute('aria-expanded', !isExpanded);
                submenu.classList.toggle('show');
                
                // Add event listener for Escape key to close menu
                if (!isExpanded) {
                    const firstSubmenuItem = submenu.querySelector('a');
                    if (firstSubmenuItem) {
                        // Focus the first item in the submenu
                        setTimeout(() => {
                            firstSubmenuItem.focus();
                        }, 100);
                    }
                    
                    const handleEscape = function(e) {
                        if (e.key === 'Escape') {
                            button.setAttribute('aria-expanded', 'false');
                            submenu.classList.remove('show');
                            button.focus();
                            document.removeEventListener('keydown', handleEscape);
                        }
                    };
                    
                    document.addEventListener('keydown', handleEscape);
                }
            });
        });
        
        // Close submenus when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-item')) {
                navMenuButtons.forEach(button => {
                    button.setAttribute('aria-expanded', 'false');
                    const submenuId = button.getAttribute('aria-controls');
                    const submenu = document.getElementById(submenuId);
                    submenu.classList.remove('show');
                });
            }
        });
        
        // Add keyboard navigation for submenus
        submenus.forEach(submenu => {
            const submenuLinks = submenu.querySelectorAll('a');
            
            submenuLinks.forEach((link, index) => {
                link.addEventListener('keydown', function(e) {
                    // Arrow down: focus next link
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const nextLink = submenuLinks[index + 1] || submenuLinks[0];
                        nextLink.focus();
                    }
                    
                    // Arrow up: focus previous link
                    if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        const prevLink = submenuLinks[index - 1] || submenuLinks[submenuLinks.length - 1];
                        prevLink.focus();
                    }
                    
                    // Escape: close submenu and focus the button
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        const button = document.querySelector(`[aria-controls="${submenu.id}"]`);
                        button.setAttribute('aria-expanded', 'false');
                        submenu.classList.remove('show');
                        button.focus();
                    }
                });
            });
        });
    }

    // Mobile menu functionality
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('show');
            
            // Trap focus within the mobile menu when it's open
            if (!isExpanded) {
                // Add overlay to prevent scrolling the background
                const overlay = document.createElement('div');
                overlay.className = 'mobile-menu-overlay';
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.right = '0';
                overlay.style.bottom = '0';
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                overlay.style.zIndex = '99';
                document.body.appendChild(overlay);
                
                // Prevent body scrolling
                document.body.style.overflow = 'hidden';
                
                // Handle click on overlay to close menu
                overlay.addEventListener('click', function() {
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    mobileMenu.classList.remove('show');
                    document.body.removeChild(overlay);
                    document.body.style.overflow = '';
                });
            } else {
                // Remove overlay and restore scrolling
                const overlay = document.querySelector('.mobile-menu-overlay');
                if (overlay) {
                    document.body.removeChild(overlay);
                }
                document.body.style.overflow = '';
            }
            
            // Announce menu state to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = isExpanded ? 'Menu closed' : 'Menu opened';
            
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                if (announcement.parentNode) {
                    document.body.removeChild(announcement);
                }
            }, 1000);
        });
    }

    // Mobile submenu functionality
    if (mobileSubmenuToggles.length > 0) {
        mobileSubmenuToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const submenuId = this.getAttribute('aria-controls');
                const submenu = document.getElementById(submenuId);
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                this.setAttribute('aria-expanded', !isExpanded);
                submenu.classList.toggle('show');
                
                // Announce submenu state to screen readers
                const announcement = document.createElement('div');
                announcement.setAttribute('role', 'status');
                announcement.setAttribute('aria-live', 'polite');
                announcement.className = 'sr-only';
                announcement.textContent = isExpanded ? 'Submenu collapsed' : 'Submenu expanded';
                
                document.body.appendChild(announcement);
                
                setTimeout(() => {
                    if (announcement.parentNode) {
                        document.body.removeChild(announcement);
                    }
                }, 1000);
            });
        });
    }

    // Tree component functionality
    const treeItems = document.querySelectorAll('.tree-item');
    const treeToggles = document.querySelectorAll('.tree-toggle');
    const treeContents = document.querySelectorAll('.tree-item-content');
    
    // Initialize the tree
    if (treeItems.length > 0) {
        // Set tabindex on the first item to make it focusable
        const firstTreeItem = document.querySelector('.tree > .tree-item:first-child > .tree-item-content');
        if (firstTreeItem) {
            firstTreeItem.setAttribute('tabindex', '0');
        }
        
        // Make all other items not focusable by default
        treeContents.forEach(content => {
            if (content !== firstTreeItem) {
                content.setAttribute('tabindex', '-1');
            }
        });
        
        // Add click event to toggle buttons
        treeToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent the item click event
                
                const treeItem = this.closest('.tree-item');
                toggleTreeItem(treeItem);
            });
        });
        
        // Add click event to tree items
        treeContents.forEach(content => {
            content.addEventListener('click', function() {
                // Focus this item
                focusTreeItem(this);
                
                // If it has a toggle button, toggle it
                const treeItem = this.closest('.tree-item');
                const toggle = treeItem.querySelector('.tree-toggle');
                
                if (toggle) {
                    toggleTreeItem(treeItem);
                }
            });
            
            // Add keyboard navigation
            content.addEventListener('keydown', handleTreeKeyDown);
        });
    }
    
    // Function to toggle a tree item's expanded state
    function toggleTreeItem(treeItem) {
        const isExpanded = treeItem.getAttribute('aria-expanded') === 'true';
        treeItem.setAttribute('aria-expanded', !isExpanded);
        
        // Announce the state change to screen readers
        const itemName = treeItem.querySelector('.tree-item-content span:last-child').textContent;
        
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `${itemName} folder ${isExpanded ? 'collapsed' : 'expanded'}`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }
    
    // Function to focus a specific tree item
    function focusTreeItem(treeContent) {
        // Remove tabindex from all items
        treeContents.forEach(content => {
            content.setAttribute('tabindex', '-1');
        });
        
        // Set tabindex on the current item
        treeContent.setAttribute('tabindex', '0');
        treeContent.focus();
    }
    
    // Handle keyboard navigation for the tree
    function handleTreeKeyDown(e) {
        const treeContent = e.currentTarget;
        const treeItem = treeContent.closest('.tree-item');
        const tree = treeContent.closest('.tree');
        
        // Get all visible tree items
        const visibleItems = getVisibleTreeItems(tree);
        const currentIndex = visibleItems.findIndex(item => item === treeContent);
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                // Move to next visible item
                if (currentIndex < visibleItems.length - 1) {
                    focusTreeItem(visibleItems[currentIndex + 1]);
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                // Move to previous visible item
                if (currentIndex > 0) {
                    focusTreeItem(visibleItems[currentIndex - 1]);
                }
                break;
                
            case 'ArrowRight':
                e.preventDefault();
                // If collapsed, expand
                if (treeItem.hasAttribute('aria-expanded') && treeItem.getAttribute('aria-expanded') === 'false') {
                    toggleTreeItem(treeItem);
                }
                // If already expanded, move to first child
                else if (treeItem.hasAttribute('aria-expanded') && treeItem.getAttribute('aria-expanded') === 'true') {
                    const firstChild = treeItem.querySelector('.tree-group > .tree-item > .tree-item-content');
                    if (firstChild) {
                        focusTreeItem(firstChild);
                    }
                }
                break;
                
            case 'ArrowLeft':
                e.preventDefault();
                // If expanded, collapse
                if (treeItem.hasAttribute('aria-expanded') && treeItem.getAttribute('aria-expanded') === 'true') {
                    toggleTreeItem(treeItem);
                }
                // If already collapsed, move to parent
                else {
                    const parentGroup = treeContent.closest('.tree-group');
                    if (parentGroup) {
                        const parentItem = parentGroup.closest('.tree-item');
                        if (parentItem) {
                            const parentContent = parentItem.querySelector('.tree-item-content');
                            focusTreeItem(parentContent);
                        }
                    }
                }
                break;
                
            case 'Home':
                e.preventDefault();
                // Move to first visible item
                if (visibleItems.length > 0) {
                    focusTreeItem(visibleItems[0]);
                }
                break;
                
            case 'End':
                e.preventDefault();
                // Move to last visible item
                if (visibleItems.length > 0) {
                    focusTreeItem(visibleItems[visibleItems.length - 1]);
                }
                break;
                
            case 'Enter':
            case ' ':
                e.preventDefault();
                // Toggle the item if it has children
                if (treeItem.hasAttribute('aria-expanded')) {
                    toggleTreeItem(treeItem);
                }
                break;
        }
    }
    
    // Function to get all visible tree items
    function getVisibleTreeItems(tree) {
        const visibleItems = [];
        
        // Helper function to recursively find visible items
        function findVisibleItems(element) {
            const items = element.children;
            
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                
                if (item.classList.contains('tree-item')) {
                    const content = item.querySelector('.tree-item-content');
                    visibleItems.push(content);
                    
                    // If this item is expanded, also include its children
                    if (item.getAttribute('aria-expanded') === 'true') {
                        const group = item.querySelector('.tree-group');
                        if (group) {
                            findVisibleItems(group);
                        }
                    }
                }
            }
        }
        
        findVisibleItems(tree);
        return visibleItems;
    }
}); 