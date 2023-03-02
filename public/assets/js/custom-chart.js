(function ($) {
    "use strict";

    /*Sale statistics Chart*/
    if ($('#myChart').length) {
        let ctx = document.getElementById('myChart').getContext('2d');
        let values = document.getElementById('monthlyData').innerHTML;
        let monthlyData = values.split(",").map(item => parseInt(item.replace(/<\/?li>/g, "")));
        let chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
            
            // The data for our dataset
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                        label: 'Sales',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(44, 120, 220, 0.2)',
                        borderColor: 'rgba(44, 120, 220)',
                        data: monthlyData
                    },
                    // {
                    //     label: 'Visitors',
                    //     tension: 0.3,
                    //     fill: true,
                    //     backgroundColor: 'rgba(4, 209, 130, 0.2)',
                    //     borderColor: 'rgb(4, 209, 130)',
                    //     data: [40, 20, 17, 9, 23, 35, 39, 30, 34, 25, 27, 17]
                    // },
                    {
                        label: 'Products',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(380, 200, 230, 0.2)',
                        borderColor: 'rgb(380, 200, 230)',
                        data: [30, 10, 27, 19, 33, 15, 19, 20, 24, 15, 37, 6]
                    }

                ]
            },
            options: {
                plugins: {
                legend: {
                    labels: {
                    usePointStyle: true,
                    },
                }
                }
            }
        });
    } //End if

    /*Sale statistics Chart*/
    if ($('#myChart2').length) {
        let ctx = document.getElementById("myChart2");
        let daylyDetails = document.getElementById("daylyData").innerHTML;
        let daylyData = daylyDetails.split(",").map(item => parseInt(item.replace(/<\/?li>/g, "")));
        console.log(daylyData);
        let barColors = [
            "#b91d47",
            "#00aba9",
            "#2b5797",
            "#e8c3b9",
            "#1e7145",
            "orange",
            "brown"
          ];
        let myChart = new Chart(ctx, {
            type: 'pie',
            data: {
            labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "thursday", "Friday", "Saturday"],
            
            datasets: [
                {
                    label: "Sale",
                    backgroundColor: barColors,
                    barThickness:10,
                    data: daylyData
                }, 
            ]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                        usePointStyle: true,
                        },
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } //end if
    
})(jQuery);