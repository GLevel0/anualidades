"use client";

import { useState, ChangeEvent, FormEvent } from "react";

type Values = {
  valor_actual: string;
  valor_futuro: string;
  tasa_nominal: string;
  tasa_por_periodo: string;
  frecuencia_de_capitalizacion: string;
  tiempo: string;
  periodos: string;
  renta: string;
};

export default function CalculatorForm() {
  const [inputs, setInputs] = useState<Values>({
    valor_actual: "",
    valor_futuro: "",
    tasa_nominal: "",
    tasa_por_periodo: "",
    frecuencia_de_capitalizacion: "",
    tiempo: "",
    periodos: "",
    renta: "",
  });

  const [resultText, setResultText] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    let checking_value = Number(value) || null
    switch (id) {
      case "frecuencia_de_capitalizacion":
        if (checking_value !== null && checking_value > 0 && Number.isInteger(checking_value)) {
          setInputs((p) => ({ ...p, [id]: value } as Values));
        }
        else if(checking_value === null) {
          setInputs((p) => ({ ...p, [id]: "" } as Values));
        }
        break;
      case "tiempo" :
        if (checking_value !== null && checking_value > 0) {
          setInputs((p) => ({ ...p, [id]: value } as Values));
        }
        else if(checking_value === null) {
          setInputs((p) => ({ ...p, [id]: value } as Values));
        }
        break;
      default :
        if (checking_value !== null && checking_value > 0) {
          setInputs((p) => ({ ...p, [id]: value } as Values));
        }
        else if(checking_value === null) {
          setInputs((p) => ({ ...p, [id]: "" } as Values));
        }
        break;
        
    }
    
    
  }

  //Metodo para calcular la tasa de interes desde la nominal.
  function calcular_i(tasa_por_periodo : number,tasa_nominal : number,frecuencia_de_capitalizacion : number){
    if(tasa_por_periodo == -1) {
      tasa_por_periodo = (tasa_nominal / frecuencia_de_capitalizacion) / 100
    } else {
      tasa_por_periodo /= 100
    }
    return tasa_por_periodo
  }

  //Metodo para calcular la cantidad de periodos.
  function calcular_periodos(periodos : number,tiempo : number, frecuencia_de_capitalizacion : number){
    if(periodos == -1) {
      periodos = tiempo * frecuencia_de_capitalizacion
    }
    return periodos
  }

  function computeResults(values: Values) {
    let resumen = `Resultados :`; //\n

    //Valores de entrada.
    let valorActual = Number(values.valor_actual) || -1;
    let valorFuturo = Number(values.valor_futuro) || -1;
    let tasa_nominal = Number(values.tasa_nominal) || -1; // percent
    let tasa_por_periodo = Number(values.tasa_por_periodo) || -1; // percent
    let tiempo = Number(values.tiempo) || -1
    let frecuencia_de_capitalizacion = Number(values.frecuencia_de_capitalizacion) || -1
    let periodos = Number(values.periodos) || -1;
    let renta = Number(values.renta) || -1;

    //Comprobaciones.
    const tenemos_tasa = ((tasa_nominal != -1 || frecuencia_de_capitalizacion != -1) || tasa_por_periodo != -1)
    const tenemos_periodo = ((tiempo != -1 && frecuencia_de_capitalizacion != -1) || periodos != -1)
    
    //Estos evenntos necesitan tener la tasa y el periodo.
    //Comprueba si se tiene/puede calcular el periodo y si se tiene/puede calcular la tasa.
    if (tenemos_tasa && tenemos_periodo) {
      tasa_por_periodo = calcular_i(tasa_por_periodo,tasa_nominal,frecuencia_de_capitalizacion)
      periodos = calcular_periodos(periodos,tiempo,frecuencia_de_capitalizacion)

      if (valorFuturo != -1) {
        resumen += `\n  Renta desde el valor futuro : ${(valorFuturo * tasa_por_periodo) / (Math.pow(1 + tasa_por_periodo, periodos) - 1)}$`
      }

      if((renta != -1)){
        resumen += `\n  Valor Futuro/Monto Acumulado : ${renta*((Math.pow(1 + tasa_por_periodo, periodos) - 1) / tasa_por_periodo)}$`
      }

      if(valorActual != -1){
        resumen += `\n  Renta desde el valor actual : ${(valorActual * tasa_por_periodo) / (1 - Math.pow(1 + tasa_por_periodo, -periodos))}$`
      }
    }

    return resumen;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = computeResults(inputs);
    setResultText(text);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 mt-4">

        
        <div>
          <label htmlFor="valor_actual">Valor Actual</label>
          <input id="valor_actual" autoComplete="off" type="number" placeholder="$" value={inputs.valor_actual} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" />
        </div>

        <div>
          <label htmlFor="valor_futuro">Valor Futuro</label>
          <input id="valor_futuro" autoComplete="off" type="number" placeholder="$" value={inputs.valor_futuro} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" />
        </div>

        <div>
          <label htmlFor="tasa_nominal">Tasa nominal</label>
          <input id="tasa_nominal" autoComplete="off" type="number" placeholder="%" value={inputs.tasa_nominal} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" />
        </div>

        <div>
          <label htmlFor="tasa_por_periodo">Tasa por periodo de capitalizacion</label>
          <input id="tasa_por_periodo" autoComplete="off" type="number" placeholder="%" value={inputs.tasa_por_periodo} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" />
        </div>

        <div>
          <label htmlFor="frecuencia_de_capitalizacion">Frecuencia de capitalizacion</label>
          <input id="frecuencia_de_capitalizacion" autoComplete="off" type="number" placeholder="m" value={inputs.frecuencia_de_capitalizacion} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" />
        </div>

        <div>
          <label htmlFor="tiempo">Tiempo</label>
          <input id="tiempo" autoComplete="off" type="number" placeholder="años" value={inputs.tiempo} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" />
        </div>

        <div>
          <label htmlFor="periodos">Periodos de capitalizacion</label>
          <input id="periodos" autoComplete="off" type="number" placeholder="n" value={inputs.periodos} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" />
        </div>

        <div>
          <label htmlFor="renta">Renta</label>
          <input id="renta" autoComplete="off" type="number" placeholder="$" value={inputs.renta} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" />
        </div>  
      </div>

      <button type="submit" className="mt-8 w-full px-4 py-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 transition focus:outline-none focus:ring-2 focus:ring-violet-500">Calcular</button>

      {resultText && (
        <pre className="mt-4 bg-zinc-100 dark:bg-zinc-900 p-3 rounded whitespace-pre-wrap">{resultText}</pre>
      )}
    </form>
  );
}
