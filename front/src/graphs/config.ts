export const Piedata = {
    labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
    datasets: [
      {
        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
        data: [40, 20, 80, 10]
      }
    ]
  }
  
  export const options = {
    responsive: true,
    maintainAspectRatio: false
  }
  

export const Bubbledata = {
    datasets: [
        {
            label: 'Bubble Dataset',
            data: [
                { x: 20, y: 30, r: 15 },
                { x: 40, y: 10, r: 10 },
                { x: 25, y: 50, r: 20 },
            ],
            backgroundColor: '#FF6384',
        },
    ],
};

export const Bardata = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Bar Dataset',
            backgroundColor: '#42A5F5',
            data: [65, 59, 80, 81, 56, 55, 40],
        },
    ],
};