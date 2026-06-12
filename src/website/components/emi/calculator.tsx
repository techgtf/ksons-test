"use client";
import { useEffect, useRef, useState } from "react";
import { Pie } from "react-chartjs-2";
import { ChartOptions, ChartData } from "chart.js";
import "chart.js/auto";
import gsap from "gsap";
import { agency, blauerNue } from "@/src/app/fonts";

export default function Index() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [loanAmount, setLoanAmount] = useState<number>(784515);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [term, setTerm] = useState<number>(8);

  const getProgress = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100 + "%";
  };

  const calculateEMI = (): number => {
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = term * 12;
    if (monthlyRate === 0) return loanAmount / totalMonths;
    const emiValue =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return emiValue;
  };

  const emi = calculateEMI();
  const totalPayment = emi * term * 12;
  const totalInterest = totalPayment - loanAmount;

  const pieData: ChartData<"pie"> = {
    labels: ["Principal Amount", "Total Interest"],
    datasets: [
      {
        data: [loanAmount, totalInterest],
        backgroundColor: ["#E9F3F9", "#0F3C78"],
        borderWidth: 1,
        borderColor: "#0F3C7810",
      },
    ],
  };

  const chartOptions: ChartOptions<"pie"> = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#0F3C78",
        titleFont: {
          size: 14,
          family: agency.style.fontFamily,
          weight: 400,
        },
        bodyFont: {
          size: 14,
          family: blauerNue.style.fontFamily,
          weight: 300,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            const value = context.raw as number;
            return ` ₹ ${value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  useEffect(() => {
    gsap.fromTo(
      ".calc-card, .summary-card, .chart-wrapper",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" },
    );
  }, []);

  return (
    <div ref={sectionRef} className="bg-white py-12 lg:py-20">
      <div className="custom-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.2fr] gap-10 items-stretch">
          {/* Left Column: Inputs */}
          <div className="flex flex-col gap-6">
            <div className="calc-card light-gradient-bg rounded-[8px] p-8">
              <div className="flex justify-between items-center mb-5">
                <label
                  className={`${agency.className} lg:text-[18px] text-[#0d3c78] lg:leading-[32px] tracking-[-0.5px]`}
                >
                  Loan Amount
                </label>
                <div
                  className={`${blauerNue.className} bg-white border border-[#0f3c78]/12 rounded-[5px] px-[24px] py-[8px] text-base font-light text-[#0d3c78] min-w-[120px] text-center lg:leading-[24px] tracking-[0.5px]`}
                >
                  ₹ {loanAmount.toLocaleString()}
                </div>
              </div>
              <div className="relative py-2">
                <input
                  type="range"
                  min="10000"
                  max="10000000"
                  step="1000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="appearance-none w-full h-[2px] rounded-[2px] bg-[#0f3c781a] outline-none cursor-pointer relative 
                    [&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:h-[2px] [&::-webkit-slider-runnable-track]:rounded-[2px]
                    [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,#0d3c78_var(--progress),rgba(15,60,120,0.1)_var(--progress))]
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-[#0d3c78] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:-mt-1
                    [&::-webkit-slider-thumb]:shadow-[0_0_0_6px_rgba(13,60,120,0.3)]
                    [&::-moz-range-track]:w-full [&::-moz-range-track]:h-[2px] [&::-moz-range-track]:bg-[#0f3c781a] [&::-moz-range-track]:rounded-[2px]
                    [&::-moz-range-progress]:bg-[#0d3c78] [&::-moz-range-progress]:h-[2px] [&::-moz-range-progress]:rounded-[2px]
                    [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#0d3c78] 
                    [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-[0_0_0_6px_rgba(13,60,120,0.3)]"
                  style={
                    {
                      "--progress": getProgress(loanAmount, 10000, 10000000),
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>

            <div className="calc-card light-gradient-bg rounded-[8px] p-8">
              <div className="flex justify-between items-center mb-5">
                <label
                  className={`${agency.className} lg:text-[18px] text-[#0d3c78] lg:leading-[32px] tracking-[-0.5px]`}
                >
                  Interest Rate (%)
                </label>
                <div
                  className={`${blauerNue.className} bg-white border border-[#0f3c78]/12 rounded-[5px] px-[24px] py-[8px] text-base font-light text-[#0d3c78] min-w-[120px] text-center lg:leading-[24px] tracking-[0.5px]`}
                >
                  {interestRate}
                </div>
              </div>
              <div className="relative py-2">
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="appearance-none w-full h-[2px] rounded-[2px] bg-[#0f3c781a] outline-none cursor-pointer relative 
                    [&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:h-[2px] [&::-webkit-slider-runnable-track]:rounded-[2px]
                    [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,#0d3c78_var(--progress),rgba(15,60,120,0.1)_var(--progress))]
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-[#0d3c78] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:-mt-1
                    [&::-webkit-slider-thumb]:shadow-[0_0_0_6px_rgba(13,60,120,0.3)]
                    [&::-moz-range-track]:w-full [&::-moz-range-track]:h-[2px] [&::-moz-range-track]:bg-[#0f3c781a] [&::-moz-range-track]:rounded-[2px]
                    [&::-moz-range-progress]:bg-[#0d3c78] [&::-moz-range-progress]:h-[2px] [&::-moz-range-progress]:rounded-[2px]
                    [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#0d3c78] 
                    [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-[0_0_0_6px_rgba(13,60,120,0.3)]"
                  style={
                    {
                      "--progress": getProgress(interestRate, 1, 30),
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>

            <div className="calc-card light-gradient-bg rounded-[8px] p-8">
              <div className="flex justify-between items-center mb-5">
                <label
                  className={`${agency.className} lg:text-[18px] text-[#0d3c78] lg:leading-[32px] tracking-[-0.5px]`}
                >
                  Terms (Years)
                </label>
                <div
                  className={`${blauerNue.className} bg-white border border-[#0f3c78]/12 rounded-[5px] px-[24px] py-[8px] text-base font-light text-[#0d3c78] min-w-[120px] text-center lg:leading-[24px] tracking-[0.5px]`}
                >
                  {term}
                </div>
              </div>
              <div className="relative py-2">
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={term}
                  onChange={(e) => setTerm(Number(e.target.value))}
                  className="appearance-none w-full h-[2px] rounded-[2px] bg-[#0f3c781a] outline-none cursor-pointer relative 
                    [&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:h-[2px] [&::-webkit-slider-runnable-track]:rounded-[2px]
                    [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,#0d3c78_var(--progress),rgba(15,60,120,0.1)_var(--progress))]
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-[#0d3c78] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:-mt-1
                    [&::-webkit-slider-thumb]:shadow-[0_0_0_6px_rgba(13,60,120,0.3)]
                    [&::-moz-range-track]:w-full [&::-moz-range-track]:h-[2px] [&::-moz-range-track]:bg-[#0f3c781a] [&::-moz-range-track]:rounded-[2px]
                    [&::-moz-range-progress]:bg-[#0d3c78] [&::-moz-range-progress]:h-[2px] [&::-moz-range-progress]:rounded-[2px]
                    [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#0d3c78] 
                    [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-[0_0_0_6px_rgba(13,60,120,0.3)]"
                  style={
                    {
                      "--progress": getProgress(term, 1, 30),
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>
          </div>

          {/* Middle Column: Summary */}
          <div className="summary-card flex flex-col gap-10 lg:gap-20 justify-center items-center text-center p-8 light-gradient-bg rounded-[8px]">
            <div className=" w-full">
              <span
                className={`${agency.className} text-[#0d3c78] lg:text-[18px] lg:leading-[32px] tracking-[-0.5px] mb-3 block`}
              >
                Emi/Month
              </span>
              <span
                className={`${blauerNue.className} lg:text-[18px] font-light tracking-[0.5px] lg:leading-[24px] text-[#0d3c78] block`}
              >
                ₹{" "}
                {emi.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className=" w-full">
              <span
                className={`${agency.className} text-[#0d3c78] lg:text-[18px] lg:leading-[32px] tracking-[-0.5px] mb-3 block`}
              >
                Total Interest Payable
              </span>
              <span
                className={`${blauerNue.className} lg:text-[18px] font-light tracking-[0.5px] lg:leading-[24px] text-[#0d3c78] block`}
              >
                ₹{" "}
                {totalInterest.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className=" w-full">
              <span
                className={`${agency.className} text-[#0d3c78] lg:text-[18px] lg:leading-[32px] tracking-[-0.5px] mb-3 block`}
              >
                Total of Payments
              </span>
              <span
                className={`${blauerNue.className} lg:text-[18px] font-light tracking-[0.5px] lg:leading-[24px] text-[#0d3c78] block`}
              >
                ₹{" "}
                {totalPayment.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {/* Right Column: Chart */}
          <div className="flex flex-col items-center justify-between">
            <div className="chart-wrapper w-full h-[350px] max-w-[350px] lg:mt-10 mt-5">
              <Pie data={pieData} options={chartOptions} />
            </div>
            <div className="flex gap-10 justify-center items-center w-full flex-wrap">
              <div
                className={`flex items-center gap-2 ${blauerNue.className} text-[14px] font-light tracking-[0.5px] lg:leading-[24px] text-[#0d3c78] block`}
              >
                <div className="w-[25px] h-[10px] rounded-[2px] border border-[#0f3c78]/10 bg-[#F5F7FA]"></div>
                <span>Principal Amount</span>
              </div>
              <div
                className={`flex items-center gap-2 ${blauerNue.className} text-[14px] font-light tracking-[0.5px] lg:leading-[24px] text-[#0d3c78] block`}
              >
                <div className="w-[25px] h-[10px] rounded-[2px] bg-[#0d3c78]"></div>
                <span>Total Interest</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
