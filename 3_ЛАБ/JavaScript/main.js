document.addEventListener("DOMContentLoaded", function() {
   showTable('build', buildings);

   const dataForm = {
       xAxis: "Год",
       showMax: true,
       showMin: true,
       type: "bar"
   };

   drawGraph(buildings, dataForm);

   // Обработчик для кнопки показа/скрытия таблицы
   const btnTable = document.getElementById("toggle-btn");
   const table = document.getElementById("build");

   btnTable.addEventListener("click", function() {
      if (btnTable.textContent === "Скрыть таблицу") {
         btnTable.textContent = "Показать таблицу";
         table.innerHTML = "";
      } else {
         btnTable.textContent = "Скрыть таблицу";
         showTable('build', buildings);
      }
   });

   // Обработчик для кнопки построения графика
   const btnGraph = document.getElementById("draw-graph-btn");
   
   btnGraph.addEventListener("click", function() {
      // Собираем данные из формы
      const xAxisElements = document.getElementsByName("xAxisGroup");
      let selectedXAxis;
      for (const el of xAxisElements) {
          if (el.checked) {
              selectedXAxis = el.value;
              break;
          }
      }

      const currentForm = {
          xAxis: selectedXAxis,
          showMax: document.getElementById("showMax").checked,
          showMin: document.getElementById("showMin").checked,
          type: document.getElementById("chartType").value
      };

      const labelMax = document.getElementById("labelMax");
      const labelMin = document.getElementById("labelMin");

      if (!currentForm.showMax && !currentForm.showMin) {
          if (labelMax && labelMin) {
              labelMax.style.color = "red";
              labelMin.style.color = "red";
          }
          return;
      } else {
          if (labelMax && labelMin) {
              labelMax.style.color = "";
              labelMin.style.color = "";
          }
      }

      // Отрисовываем график с новыми параметрами
      drawGraph(buildings, currentForm);
   });
})