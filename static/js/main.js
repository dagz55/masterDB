document.addEventListener('DOMContentLoaded', function() {
    const daySelect = document.getElementById('daySelect');
    const filterButton = document.getElementById('filterButton');
    const serverTable = document.getElementById('serverTable');
    const darkModeToggle = document.getElementById('darkModeToggle');

    filterButton.addEventListener('click', fetchServers);
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark');
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark');
        localStorage.setItem('darkMode', document.body.classList.contains('dark') ? 'enabled' : 'disabled');
    }

    function fetchServers() {
        const selectedDay = daySelect.value;
        if (!selectedDay) {
            alert('Please select a day.');
            return;
        }

        fetch(`/get_servers?day=${encodeURIComponent(selectedDay)}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                populateServerTable(data);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while fetching server data.');
            });
    }

    function populateServerTable(servers) {
        const tbody = serverTable.querySelector('tbody');
        tbody.innerHTML = ''; // Clear existing rows

        servers.forEach(server => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td class="py-2 px-4 border-b border-primary-200 dark:border-primary-700">${server.Server_Name}</td>
                <td class="py-2 px-4 border-b border-primary-200 dark:border-primary-700">${server.App_Code}</td>
                <td class="py-2 px-4 border-b border-primary-200 dark:border-primary-700">${server.Env}</td>
                <td class="py-2 px-4 border-b border-primary-200 dark:border-primary-700">${server.Deployment}</td>
                <td class="py-2 px-4 border-b border-primary-200 dark:border-primary-700">${server.LOCATION}</td>
                <td class="py-2 px-4 border-b border-primary-200 dark:border-primary-700">${server.Patch_Date_MNL}</td>
                <td class="py-2 px-4 border-b border-primary-200 dark:border-primary-700">${server.Patch_Start_Time_MNL}</td>
                <td class="py-2 px-4 border-b border-primary-200 dark:border-primary-700">${server.Patch_End_Time_MNL}</td>
                <td class="py-2 px-4 border-b border-primary-200 dark:border-primary-700">${server.Patch_Start_Time_PST}</td>
                <td class="py-2 px-4 border-b border-primary-200 dark:border-primary-700">${server.Patch_End_Time_PST}</td>
                <td class="py-2 px-4 border-b border-primary-200 dark:border-primary-700">${server.App_Support_Group_email}</td>
                <td class="py-2 px-4 border-b border-primary-200 dark:border-primary-700">
                    <button onclick="createCalendarInvite('${server.Server_Name}')" class="bg-primary-500 hover:bg-primary-600 text-white py-1 px-2 rounded">
                        Create Invite
                    </button>
                </td>
            `;
        });
    }

    window.createCalendarInvite = function(serverName) {
        // Implement the calendar invite creation logic here
        console.log(`Creating calendar invite for server: ${serverName}`);
        // You can use the Outlook API or generate an .ics file here
        alert(`Calendar invite creation for ${serverName} is not yet implemented.`);
    }
});