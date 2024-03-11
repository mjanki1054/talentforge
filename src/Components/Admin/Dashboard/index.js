import React from "react";
import Card from "./Cards"
import Chart from "./Charts/Month";
import CircleChart from "./Charts/Subject";
import Events from "./Events"


function Home() {
    return (
        <>
            <div className="container pb-[60px]" >
                <div className="container p-4 ml-2 my-1 rounded-lg bg-gray-100 mt-6">
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-1">
                        <Card text="Exams" storage="20" icon="computer" bgColor="bg-blue-400" extraText="+50 more than last month" />
                        <Card text="Groups" storage="15" icon="people" bgColor="bg-emerald-400" extraText="+10 more than last month" />
                        <Card text="Candidates" storage="500" icon="person" bgColor="bg-rose-400" extraText="+100 more than last month" />
                        <Card text="Questions" storage="50" icon="question" bgColor="bg-fuchsia-500" extraText="+20 more than last month" />
                    </div>
                </div>

                <div className=" bg-gray-100 ml-2 pl-4 pr-4 my-4 py-2">
                    <div className="grid grid-cols-2 xl:grid-cols-12 gap-6">
                        <div className="col-span-12 xl:col-span-8 h-50">
                            <Chart />
                        </div>
                        <div className="col-span-12 xl:col-span-4">
                            <CircleChart />
                        </div>
                    </div>
                </div>

                <Events />

            </div>
        </>
    );
}

export default Home;