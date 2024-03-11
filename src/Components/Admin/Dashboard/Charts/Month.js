import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';

const Month = () => {
    const chartData = [
        { month: 'Jan', candidates: 90, questions: 20 },
        { month: 'Feb', candidates: 60, questions: 15 },
        { month: 'Mar', candidates: 70, questions: 10 },
        { month: 'Apr', candidates: 80, questions: 5 },
        { month: 'May', candidates: 90, questions: 5 },
        { month: 'June', candidates: 80, questions: 10 },
        { month: 'July', candidates: 70, questions: 15 },
        { month: 'Aug', candidates: 60, questions: 20 },
        { month: 'Sept', candidates: 50, questions: 25 },
        { month: 'Oct', candidates: 40, questions: 30 },
        { month: 'Nov', candidates: 30, questions: 35 },
        { month: 'Dec', candidates: 20, questions: 40 },
    ];

    const DataFormatter = (number) => {
        if (number > 1000) {
            return `${(number / 1000).toString()}k`;
        }
        return number.toString();
    };

    return (
        <div className="bg-white h-[250px] rounded-md p-4 shadow-lg">
            <h1 className="text-2xl font-semibold mb-4">Questions/Candidates</h1>
            <ResponsiveContainer height={200}>
                <BarChart data={chartData}>
                    <XAxis dataKey="month" tick={{ stroke: 'black', strokeWidth: 0.5 }} />
                    <YAxis
                        tickFormatter={DataFormatter}
                        tick={{ stroke: 'black', strokeWidth: 0.5 }}
                    />
                    <Legend wrapperStyle={{ padding: 30 }} />
                    <Bar dataKey="candidates" name="Total candidates" fill="#0088FE" />
                    <Bar dataKey="questions" name="No. of Questions" fill="#FF8042" />
                </BarChart>

            </ResponsiveContainer>
        </div>
    );
};

export default Month;