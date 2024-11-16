'use client';
import { usdc } from "@/abi";
import { Button } from "@/components/ui/button";
import { useTaxiTime } from "@/hooks/api/use-taxi-time";
import { useRouter, useSearchParams } from "next/navigation";
import { parseUnits } from "viem";
import { useWriteContract } from "wagmi";
import PayBtn from "./PayBtn";

export default function EstData() {
    
    const searchParams = useSearchParams();
    // http://localhost:3000/insurance?originLongitude=100.5583005&originLatitude=13.7247806&placeId=ChIJ3UPIL_6e4jARVH4S0xM70xw
    const origin = searchParams?.get('origin') ?? '';
    const destination = searchParams?.get('destination') ?? '';
    const { data, isLoading, error } = useTaxiTime({
        origin: origin,
        destination: destination
    })
    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
            <span className="ml-3 text-lg text-gray-600">Calculating route...</span>
        </div>
    )
    
    const {
        distance = 0,
        duration = 0,
        durationInTraffic = 0,
        origin: originName = "",
        destination: destName = ""
    } = data
    return < div className="py-8 px-4" >
        <div className="flex flex-col gap-1">
            <div>Est. time:</div>
            <div className="border p-4 text-center text-4xl font-bold">
                {Math.floor(durationInTraffic / 60 / 60)}:{Math.floor((durationInTraffic / 60) % 60)}:{Math.floor((durationInTraffic % 60) % 60)}
            </div>
            <div className="text-center">Arrive at {(new Date(new Date().getTime() + durationInTraffic * 1000)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
        </div>
        <div className="mt-8" >
            <h4 className="mt-4 text-center text-lg font-bold">Purchase an Insurance</h4>
            <div className="text-center mt-4">
                <span>Arrive latest time: <div className="text-center">{new Date(new Date().getTime() + durationInTraffic * 1100).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div></span>
                <div>From: {originName}</div>
                <div>To: {destName}</div>
                <div>Distance: {(distance / 1000).toFixed(2)} KM</div>
                <div>Baht: 20</div>
            </div>
        </div>
        <PayBtn />
    </div >
}