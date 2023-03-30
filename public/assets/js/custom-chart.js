(function ($) {
    "use strict";
    $(document).ready
    /*Sale statistics Chart*/
    if ($('#myChart').length) {
        const monthlyDataStr = $('#myChartData').data('monthly');
        const monthlyData = monthlyDataStr.split(",").map(Number);

        let ctx = document.getElementById('myChart').getContext('2d');
        let chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Monthly Sales',
                    tension: 0.3,
                    fill: true,
                    backgroundColor: 'rgba(44, 120, 220, 0.2)',
                    borderColor: 'rgba(44, 120, 220)',
                    data: monthlyData
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
                }
            }
        });
    } //End if

    /*Sale statistics Chart*/
    if ($('#myChart2').length) {
        let ctx = document.getElementById("myChart2");
        const paymentStr = $('#myChartData').data('payment');
        const paymentData = paymentStr.split(",").map(Number);
        let barColors = [
            // "#b91d47",
            "#00aba9",
            // "#e8c3b9",
            "#1e7145",
            "#2b5797",
            // "orange",
            // "brown"
        ];
        let myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ["COD","RAZORPAY", "PAYPAL"],

                datasets: [
                    {
                        label: "Sale",
                        backgroundColor: barColors,
                        barThickness: 10,
                        data: paymentData
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

    /*Sale statistics Chart*/
    if ($('#myChart3').length) {
        const dailyDataStr = $('#myChartData').data("daily");
        const dailyData = dailyDataStr.split(",").map(Number);

        let ctx = document.getElementById('myChart3').getContext('2d');
        let chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "thursday", "Friday", "Saturday"],
                datasets: [{
                    label: 'Daily Sales',
                    tension: 0.3,
                    fill: true,
                    backgroundColor: 'rgba(380, 200, 230, 0.2)',
                    borderColor: 'rgb(380, 200, 230)',
                    data: dailyData
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
                }
            }
        });
    } //End if

    // /*Sale statistics Chart*/
    // if ($('#myChart4').length) {
    //     let ctx = document.getElementById("myChart4");
    //     const categoryDataStr = $('#myChartData').data("category");
    //     console.log(categoryDataStr)
    //     const categoryData = categoryDataStr.split(",").map(Number);

    //     let barColors = [
    //         "#b91d47",
    //         "#00aba9",
    //         "#2b5797",
    //         "#e8c3b9",
    //         "#1e7145",
    //         "orange",
    //         "brown"
    //     ];
    //     let myChart = new Chart(ctx, {
    //         type: 'pie',
    //         data: {
    //             labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "thursday", "Friday", "Saturday"],

    //             datasets: [
    //                 {
    //                     label: "Sale",
    //                     backgroundColor: barColors,
    //                     barThickness: 10,
    //                     data: categoryData
    //                 },
    //             ]
    //         },
    //         options: {
    //             plugins: {
    //                 legend: {
    //                     labels: {
    //                         usePointStyle: true,
    //                     },
    //                 }
    //             },
    //             scales: {
    //                 y: {
    //                     beginAtZero: true
    //                 }
    //             }
    //         }
    //     });
    // } //end if

})(jQuery);