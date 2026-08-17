// =========================================================
// NOC DASHBOARD
// Live Network Operations Simulation
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // LIVE CLOCK
    // =====================================================

    const clock = document.getElementById("noc-time");

    function getCurrentTime() {
        return new Date().toLocaleTimeString("en-GB", {
            hour12: false
        });
    }

    function updateClock() {
        if (clock) {
            clock.textContent = getCurrentTime();
        }
    }

    updateClock();
    setInterval(updateClock, 1000);


    // =====================================================
    // NETWORK STATUS
    // =====================================================

    const systemStatus =
        document.querySelector(".system-status span:last-child");

    if (systemStatus) {
        systemStatus.textContent = "NETWORK OPERATIONAL";
    }


    // =====================================================
    // NETWORK UTILIZATION
    // =====================================================

    const utilizationBars =
        document.querySelectorAll(".mini-bar span");

    const utilizationNumbers =
        document.querySelectorAll(".layer-item strong");

    const networkLayers = [
        "CORE",
        "METRO",
        "AGGREGATION",
        "ACCESS"
    ];

    const utilization = {
        CORE: 68,
        METRO: 61,
        AGGREGATION: 74,
        ACCESS: 57
    };


    function generateUtilization() {

        networkLayers.forEach(layer => {

            const change =
                Math.floor(Math.random() * 11) - 5;

            utilization[layer] = Math.max(
                20,
                Math.min(
                    95,
                    utilization[layer] + change
                )
            );
        });
    }


    function renderUtilization() {

        networkLayers.forEach((layer, index) => {

            const value = utilization[layer];

            if (utilizationBars[index]) {
                utilizationBars[index].style.width =
                    `${value}%`;
            }

            if (utilizationNumbers[index]) {
                utilizationNumbers[index].textContent =
                    `${value}%`;
            }
        });
    }


    renderUtilization();


    // =====================================================
    // NETWORK HEALTH
    // =====================================================

    const healthScore =
        document.querySelector(".health-score");

    const healthProgress =
        document.querySelector(".health-progress");


    function calculateHealth() {

        const values = Object.values(utilization);

        const average =
            values.reduce(
                (total, value) => total + value,
                0
            ) / values.length;

        return Math.round(
            Math.max(
                80,
                Math.min(
                    100,
                    100 - (average - 50) * 0.35
                )
            )
        );
    }


    function updateNetworkHealth() {

        const health = calculateHealth();

        if (healthScore) {
            healthScore.textContent = `${health}%`;
        }

        if (healthProgress) {
            healthProgress.style.width = `${health}%`;
        }
    }


    updateNetworkHealth();


    setInterval(() => {

        generateUtilization();
        renderUtilization();
        updateNetworkHealth();

    }, 5000);


    // =====================================================
    // ALARM / EVENT ENGINE
    // =====================================================

    const alarms = [
        {
            severity: "WARNING",
            severityClass: "warning",
            element: "Metro-AGG-04",
            event: "High interface utilization",
            status: "Monitoring",
            statusClass: "monitoring"
        },
        {
            severity: "CRITICAL",
            severityClass: "critical",
            element: "OSN-8800-02",
            event: "Optical power threshold",
            status: "Investigating",
            statusClass: "investigating"
        },
        {
            severity: "INFO",
            severityClass: "info",
            element: "CORE-RTR-01",
            event: "BGP session established",
            status: "Resolved",
            statusClass: "resolved"
        },
        {
            severity: "INFO",
            severityClass: "info",
            element: "SDH-ADM-12",
            event: "Maintenance completed",
            status: "Resolved",
            statusClass: "resolved"
        }
    ];


    const liveEvents = [
        {
            severity: "INFO",
            severityClass: "info",
            element: "CORE-RTR-01",
            event: "OSPF neighbor stable",
            status: "Monitoring",
            statusClass: "monitoring"
        },
        {
            severity: "WARNING",
            severityClass: "warning",
            element: "METRO-SW-07",
            event: "Interface utilization 78%",
            status: "Monitoring",
            statusClass: "monitoring"
        },
        {
            severity: "INFO",
            severityClass: "info",
            element: "OSN-8800-02",
            event: "Optical link restored",
            status: "Resolved",
            statusClass: "resolved"
        },
        {
            severity: "WARNING",
            severityClass: "warning",
            element: "AGG-RTR-03",
            event: "Packet loss detected",
            status: "Investigating",
            statusClass: "investigating"
        }
    ];


    const alarmTable =
        document.querySelector(".alarm-table");

    const alarmCount =
        document.querySelector(".alarm-count");

    let eventIndex = 0;


    function renderAlarms() {

        if (!alarmTable) return;

        alarmTable.innerHTML = `
            <div class="alarm-row alarm-header">
                <span>TIME</span>
                <span>SEVERITY</span>
                <span>ELEMENT</span>
                <span>EVENT</span>
                <span>STATUS</span>
            </div>
        `;

        alarms.forEach(alarm => {

            const row =
                document.createElement("div");

            row.className = "alarm-row";

            row.innerHTML = `
                <span>${getCurrentTime()}</span>

                <span class="severity ${alarm.severityClass}">
                    ${alarm.severity}
                </span>

                <span>${alarm.element}</span>

                <span>${alarm.event}</span>

                <span class="event-status ${alarm.statusClass}">
                    ${alarm.status}
                </span>
            `;

            alarmTable.appendChild(row);
        });

        if (alarmCount) {
            alarmCount.textContent =
                `${alarms.length
                    .toString()
                    .padStart(2, "0")} EVENTS`;
        }
    }


    renderAlarms();


    // New network event every 8 seconds.

    setInterval(() => {

        alarms.unshift(liveEvents[eventIndex]);

        if (alarms.length > 6) {
            alarms.pop();
        }

        eventIndex =
            (eventIndex + 1) %
            liveEvents.length;

        renderAlarms();

    }, 8000);


    // =====================================================
    // ACTIVITY LOG
    // =====================================================

    const activityPanel =
        document.querySelector(".activity-panel");

    const activityMessages = [
        "Core routing adjacency verified",
        "Metro aggregation link monitored",
        "Optical transmission parameters stable",
        "Network utilization statistics updated",
        "NOC monitoring cycle completed"
    ];

    let activityIndex = 0;


    function addActivity() {

        if (!activityPanel) return;

        const item =
            document.createElement("div");

        item.className = "activity-item";

        item.innerHTML = `
            <div class="activity-icon">
                <i class="fa-solid fa-circle-check"></i>
            </div>

            <div>
                <strong>
                    ${activityMessages[activityIndex]}
                </strong>

                <p>
                    Automated NOC monitoring event
                </p>
            </div>

            <time>
                ${getCurrentTime()}
            </time>
        `;

        activityPanel.prepend(item);

        const items =
            activityPanel.querySelectorAll(".activity-item");

        if (items.length > 6) {
            items[items.length - 1].remove();
        }

        activityIndex =
            (activityIndex + 1) %
            activityMessages.length;
    }


    setInterval(addActivity, 10000);


    // =====================================================
    // TOPOLOGY STATUS
    // =====================================================

    const topologyNodes =
        document.querySelectorAll(".topology-node");

    const nodeStatus = {
        core: "OPERATIONAL",
        metro: "OPERATIONAL",
        aggregation: "OPERATIONAL",
        access: "OPERATIONAL"
    };


    topologyNodes.forEach(node => {

        node.addEventListener("click", () => {

            const name =
                node.dataset.node;

            const status =
                nodeStatus[name] || "UNKNOWN";

            console.log(
                `${name.toUpperCase()} NETWORK STATUS: ${status}`
            );

            alert(
                `${name.toUpperCase()}\n\nSTATUS: ${status}`
            );
        });

    });


    // =====================================================
    // INITIALIZATION
    // =====================================================

    console.log(
        "NOC Dashboard initialized successfully."
    );

    console.log(
        "Monitoring: CORE | METRO | AGGREGATION | ACCESS"
    );

});