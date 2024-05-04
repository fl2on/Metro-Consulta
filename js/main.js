async function consultarTarjeta() {
   const numeroTarjeta = document.getElementById('numeroTarjeta').value;
   const url = `https://corsproxy.io/?https://saldometrobus.yizack.com/api/v2/tarjeta/${numeroTarjeta}`;

   try {
      const response = await fetch(url);
      const data = await response.json();

      const info = document.getElementById('info');
      const grafico = document.getElementById('grafico');
      const movimientos = document.getElementById('movimientos');

      info.innerHTML = '';
      grafico.innerHTML = '';
      movimientos.innerHTML = '';

      const { tarjeta } = data;

      const h2Info = document.createElement('h2');
      h2Info.textContent = `Tarjeta: ${tarjeta.numero}`;

      const pInfo1 = document.createElement('p');
      pInfo1.textContent = `Saldo Actual: ${tarjeta.saldo}`;

      const pInfo2 = document.createElement('p');
      pInfo2.textContent = `Estado: ${tarjeta.estado}`;

      const pInfo3 = document.createElement('p');
      pInfo3.textContent = `Fecha del Saldo: ${tarjeta.fecha}`;

      const saldoProgress = document.createElement('div');
      saldoProgress.className = 'saldo-progress';
      const saldoProgressBar = document.createElement('div');
      saldoProgressBar.className = 'saldo-progress-bar';
      const saldo = parseFloat(tarjeta.saldo);
      const saldoText = document.createElement('div');
      saldoText.className = 'saldo-text';
      saldoText.textContent = `$${saldo.toFixed(2)} / $50`;
      saldoProgressBar.style.width = `${(saldo / 50) * 100}%`;
      saldoProgress.appendChild(saldoProgressBar);
      saldoProgress.appendChild(saldoText);

      info.appendChild(h2Info);
      info.appendChild(pInfo1);
      info.appendChild(pInfo2);
      info.appendChild(pInfo3);
      info.appendChild(saldoProgress);

      const labels = tarjeta.movimientos.map(movimiento => movimiento.fecha_hora);
      const gastos = tarjeta.movimientos.map(movimiento => movimiento.monto);
      const cargas = tarjeta.movimientos.map(movimiento => movimiento.tipo === 'Carga' ? movimiento.monto : 0);
      const cambioSaldo = tarjeta.movimientos.map(movimiento => movimiento.saldo_tarjeta);

      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      grafico.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
         type: 'line',
         data: {
            labels: labels,
            datasets: [{
                  label: 'Gastos',
                  data: gastos,
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1
               },
               {
                  label: 'Recargas',
                  data: cargas,
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
               },
               {
                  label: 'Cambio de Saldo',
                  data: cambioSaldo,
                  backgroundColor: 'rgba(153, 102, 255, 0.2)',
                  borderColor: 'rgba(153, 102, 255, 1)',
                  borderWidth: 1
               }
            ]
         },
         options: {
            scales: {
               y: {
                  beginAtZero: true
               }
            }
         }
      });

      tarjeta.movimientos.forEach((movimiento) => {
         const card = document.createElement('div');
         card.className = 'movimiento';

         const h2 = document.createElement('h2');
         h2.textContent = `Transacción: ${movimiento.transaccion}`;

         const p1 = document.createElement('p');
         p1.textContent = `Tipo: ${movimiento.tipo}`;

         const p2 = document.createElement('p');
         p2.textContent = `Fecha y hora: ${movimiento.fecha_hora}`;

         const p3 = document.createElement('p');
         p3.textContent = `Monto: ${movimiento.monto}`;

         const p4 = document.createElement('p');
         const saldoTexto = parseFloat(movimiento.monto);
         if (movimiento.tipo === 'Carga') {
            p4.innerHTML = `Saldo: <span class="green-text">+${saldoTexto.toFixed(2)}</span>`;
         } else if (saldoTexto === 0) {
            p4.innerHTML = `Saldo: <span style="color:orange">${saldoTexto.toFixed(2)}</span>`;
         } else {
            p4.innerHTML = `Saldo: <span class="red-text">-${saldoTexto.toFixed(2)}</span>`;
         }
         const p5 = document.createElement('p');
         p5.textContent = `Lugar: ${movimiento.lugar}`;

         movimientos.appendChild(card);
         card.appendChild(h2);
         card.appendChild(p1);
         card.appendChild(p2);
         card.appendChild(p3);
         card.appendChild(p4);
         card.appendChild(p5);
      });
   } catch (error) {
      console.error('Error:', error);
      const info = document.getElementById('info');
      info.innerHTML = 'Error al consultar la tarjeta.';
   }
}