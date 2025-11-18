"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { } from "./AmortizationTable";

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

type Fila = {
  periodo: number;
  renta: number;
  interes: number;
  capital: number;
  saldo: number;
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

  const [is_Anticipada, handleCheckbox] = useState(false);
  const [has_to_generate, handleGenerate] = useState(false);

  const [resultText, setResultText] = useState<string | null>(null);
  const [tabla, setTabla] = useState<Fila[]>([]);


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

  function generarTabla(renta:number,valorFuturo: number, tasa_por_periodo: number, periodos: number){
      let saldo = valorFuturo;
      const filas = []
      for (let p = 1; p <= periodos; p++) {
        const interes = saldo * tasa_por_periodo;
        const capital = renta - interes;
        saldo = saldo - capital;
        
        filas.push({
          periodo: p,
          renta,
          interes,
          capital,
          saldo: Math.max(saldo, 0),
        });
      }
      setTabla(filas)
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
    //Comprueba si se tiene/puede calcular la tasa.
    if (tenemos_tasa) {
      tasa_por_periodo = calcular_i(tasa_por_periodo,tasa_nominal,frecuencia_de_capitalizacion)
      
      // Comprueba si se tiene/puede calcular el periodo
      if (tenemos_periodo) {
        let operation
        if (valorFuturo != -1) {
          resumen += `\n  Renta desde el valor futuro : ${(valorFuturo * tasa_por_periodo) / (Math.pow(1 + tasa_por_periodo, periodos) - 1)}$`
        }

        if(valorActual != -1){
          resumen += `\n  Renta desde el valor actual : ${(valorActual * tasa_por_periodo) / (1 - Math.pow(1 + tasa_por_periodo, -periodos))}$`
        }

        if((renta != -1)){
          operation = renta * ((Math.pow(1 + tasa_por_periodo, periodos) - 1) / tasa_por_periodo)
          if (is_Anticipada) {
            resumen += `\n  Valor Futuro/Monto Acumulado : ${operation * (1+tasa_por_periodo)}$`
          }
          else
          {
            resumen += `\n  Valor Futuro/Monto Acumulado : ${operation}$`
          }   
        }

        if((renta != -1)){
          operation = renta * (1 - (Math.pow(1 + tasa_por_periodo, -periodos)) / tasa_por_periodo) 
          if (is_Anticipada) {
            resumen += `\n  Valor Presente/Capital inicial : ${operation * (1+tasa_por_periodo)}$`
          }
          else
          {
            resumen += `\n  Valor Presente/Capital inicial : ${operation}$`
          }
        }
      }
      
      if (valorFuturo != -1 && renta != -1) {
        let time = Math.log(((valorFuturo * tasa_por_periodo) / renta) + 1) / Math.log(1+tasa_por_periodo)
        resumen += `\n  Tiempo(REDONDEADO) : ${Math.round(time)} años`
        resumen += `\n  Tiempo(EXACTO) : ${time} años`
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

      {(has_to_generate && tabla.length > 0) && (
        <table className="w-full mt-6 border text-sm">
        <thead>
            <tr className="bg-zinc-800">
            <th className="p-2 border">Período</th>
            <th className="p-2 border">Renta</th>
            <th className="p-2 border">Interés</th>
            <th className="p-2 border">Capital</th>
            <th className="p-2 border">Saldo</th>
            </tr>
        </thead>
        <tbody>
            {tabla.map((Fila) => (
            <tr key={Fila.periodo} className="text-center">
                <td className="p-2 border">{Fila.periodo}</td>
                <td className="p-2 border">{Fila.renta.toFixed(2)}</td>
                <td className="p-2 border">{Fila.interes.toFixed(2)}</td>
                <td className="p-2 border">{Fila.capital.toFixed(2)}</td>
                <td className="p-2 border">{Fila.saldo.toFixed(2)}</td>
            </tr>
            ))}
        </tbody>
    </table>
      )}

      <div className="p-4 bg-black text-white rounded-xl">
        <label className="flex items-center gap-2 font-bold">
          <input
            type="checkbox"
            checked={is_Anticipada}
            onChange={(e) => handleCheckbox(e.target.checked)}
            className="h-4 w-4"
          />
          Es anticipada?
        </label>

        <label className="flex items-center gap-2 font-bold">
          <input
            type="checkbox"
            checked={has_to_generate}
            onChange={(e) => handleGenerate(e.target.checked)}
            className="h-4 w-4"
          />
          Generar tabla de amortizacion cuando sea posible?
        </label>
      </div>
    </form>
  );
}
