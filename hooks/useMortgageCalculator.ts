import { useState, useEffect } from "react";
import {
  calculateMonthlyPayment,
  calculateCapital,
  calculateTotalRepayment,
  calculateTotalInterest,
  calculateAffordabilityCheck,
  calculateYearlyBreakdown,
  YearlyBreakdownRecord,
} from "@/utils/MortgageCalculator/mortgageCalculations";
import { InterestRateData } from "@/services/bankOfEngland";
import { MortgageFormData, MortgageResults } from "@/types/mortgage";

export function useMortgageCalculator() {
  // FORM STATE
  const [formData, setFormData] = useState<MortgageFormData>({
    propertyPrice: 100000,
    deposit: 5000,
    mortgageTerm: 15,
    interestRate: 5.25,
  });
  const [validated, setValidated] = useState<boolean>(false);

  // RESULTS STATE
  const [results, setResults] = useState<MortgageResults | null>(null);
  const [yearlyBreakdown, setYearlyBreakdown] = useState<
    YearlyBreakdownRecord[]
  >([]);

  // BANK OF ENGLAND RATE STATE
  const [boeRate, setBoeRate] = useState<InterestRateData | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState<boolean>(false);
  const [useBoERate, setUseBoERate] = useState<boolean>(false);

  // fetch BoE rate on component mount
  useEffect(() => {
    const fetchInterestRate = async () => {
      setIsLoadingRate(true);
      try {
        const response = await fetch("/api/interest-rate");
        const data: InterestRateData = await response.json();
        setBoeRate(data);
      } catch (error) {
        console.error("Failed to fetch interest rate:", error);
      } finally {
        setIsLoadingRate(false);
      }
    };

    fetchInterestRate();
  }, []);

  // apply BoE rate when toggle is switched
  useEffect(() => {
    if (useBoERate && boeRate && !boeRate.isError) {
      setFormData((prev) => ({
        ...prev,
        interestRate: boeRate.rate,
      }));
    }
  }, [useBoERate, boeRate]);

  const handleBoERateToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseBoERate(e.target.checked);
  };

  const validateForm = (): boolean => {
    if (formData.propertyPrice <= 0) return false;
    if (formData.deposit < 0) return false;
    if (formData.deposit >= formData.propertyPrice) return false;
    if (formData.mortgageTerm <= 0) return false;
    if (formData.interestRate < 0) return false;
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0,
    });
  };

  const calculateResults = () => {
    if (!validateForm()) {
      setValidated(true);
      return;
    }

    const { propertyPrice, deposit, mortgageTerm, interestRate } = formData;

    const monthlyPayment = calculateMonthlyPayment(
      propertyPrice,
      deposit,
      interestRate,
      mortgageTerm
    );
    const capital = calculateCapital(propertyPrice, deposit);
    const totalRepayment = calculateTotalRepayment(
      monthlyPayment,
      mortgageTerm
    );
    const interest = calculateTotalInterest(totalRepayment, capital);
    const affordabilityCheck = calculateAffordabilityCheck(
      propertyPrice,
      deposit,
      interestRate,
      mortgageTerm
    );
    const breakdown = calculateYearlyBreakdown(
      propertyPrice,
      deposit,
      interestRate,
      mortgageTerm
    );

    setResults({
      monthlyPayment,
      totalRepayment,
      capital,
      interest,
      affordabilityCheck,
    });

    setYearlyBreakdown(breakdown);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    calculateResults();
  };

  return {
    formData,
    validated,
    results,
    yearlyBreakdown,
    boeRate,
    isLoadingRate,
    useBoERate,
    handleInputChange,
    handleBoERateToggle,
    handleSubmit,
  };
}

export default useMortgageCalculator;
