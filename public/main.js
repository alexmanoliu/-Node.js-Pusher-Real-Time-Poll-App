const form = document.getElementById('vote-form');

// Form submit event
form.addEventListener('submit', e => {
 const choice = document.querySelector('input[name=smartphone]:checked').value;
 const data = { smartphone: choice };

 fetch('http://localhost:3000/poll', {
     method: 'post',
     body: JSON.stringify(data),
     headers: new Headers({
         'Content-Type':'application/json'
     })
 })

 .then(res => res.json())
 .then(data => console.log(data))
 .catch(err => console.log(err));

    e.preventDefault();
});

fetch('http://localhost:3000/poll')
.then(res => res.json())
.then(data => {
    const votes = data.votes;
    const totalVotes = votes.length;
    // Count votes points - accumulate/currentvalue
    const voteCounts = votes.reduce((acc, vote) => (acc[vote.smartphone] = ((acc[vote.smartphone] || 0) + parseInt(vote.points)), acc), {});

    let dataPoints = [
        { label: 'SamsungS8', y: voteCounts.SamsungS8 },
        { label: 'Huawei', y: voteCounts.Huawei },
        { label: 'Oneplus5t', y: voteCounts.Oneplus5t },
        { label: 'IphoneX', y: voteCounts.IphoneX }
    ];
    
    const chartContainer = document.querySelector('#chartContainer');
    
    
    if(chartContainer) {
      const chart = new CanvasJS.Chart('chartContainer', {
          animationEnabled: true,
          theme: 'theme1',
          title: {
              text: `Total Votes ${totalVotes}`
          },
          data: [
              {
                  type: 'column',
                  dataPoints: dataPoints
              }
          ]
      });
      chart.render();
    
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;
    
    var pusher = new Pusher('94164259027f0262bd48', {
      cluster: 'eu',
      encrypted: true
    });
    
    var channel = pusher.subscribe('smartphone-poll');
    channel.bind('smartphone-vote', function(data) {
      dataPoints = dataPoints.map(x => {
          if(x.label == data.smartphone) {
              x.y += data.points;
              return x;
          } else {
              return x;
          }
      });
      chart.render();
    });
    
    }
});

