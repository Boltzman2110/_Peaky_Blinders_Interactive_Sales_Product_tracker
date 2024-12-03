const dataFilePath = "sales.csv"; // Path to your data file

// Load data and initialize chart
document.addEventListener("DOMContentLoaded", () => {
    fetch(dataFilePath)
        .then(response => response.text())
        .then(data => {
            const parsedData = parseCSV(data);
            populateCategories(parsedData);
            createChart(parsedData);
        });
});

// Parse CSV data
function parseCSV(data) {
    const rows = data.split("\n").map(row => row.split(","));
    const headers = rows[0];
    const records = rows.slice(1).map(row => {
        let obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index];
        });
        return obj;
    });
    return records;
}

// Populate category dropdown
function populateCategories(data) {
    const categories = [...new Set(data.map(row => row.Genre))];
    const categorySelect = document.getElementById("category");
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Create Chart.js chart
let chart;
function createChart(data) {
    const ctx = document.getElementById("salesChart").getContext("2d");
    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.map(row => row.Name),
            datasets: [{
                label: "Global Sales",
                data: data.map(row => parseFloat(row.Global_Sales)),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

// Update chart based on category filter
function updateChart() {
    const selectedCategory = document.getElementById("category").value;
    fetch(dataFilePath)
        .then(response => response.text())
        .then(data => {
            const parsedData = parseCSV(data);
            const filteredData = parsedData.filter(row => row.Genre === selectedCategory);
            chart.data.labels = filteredData.map(row => row.Name);
            chart.data.datasets[0].data = filteredData.map(row => parseFloat(row.Global_Sales));
            chart.update();
        });
}
