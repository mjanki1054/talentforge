import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
    { subject: 'Quantitative', value: 90 },
    { subject: 'Verbal', value: 85 },
    { subject: 'DBMS', value: 70 },
    { subject: 'Networking', value: 75 },
    { subject: 'Cloud', value: 80 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Subject = () => {
    return (
        <div className="bg-white p-4 rounded-md shadow-lg">
            <h1 className="text-center font-semibold mb-4">Subject Performance</h1>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
                    {data.map((entry, index) => (
                        <div key={`legend-${index}`} className="flex items-center mb-2">
                            <span
                                className="inline-block w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></span>
                            <span>{entry.subject}</span>
                        </div>
                    ))}
                </div>
                <div className="col-span-7 pb-5 ">
                    <ResponsiveContainer width="100%" height={159}>
                        <PieChart style={{ marginLeft: '-1rem' }}>
                            <Pie
                                data={data}
                                dataKey="value"
                                outerRadius={80}
                                fill="#8884d8"
                                labelLine={false}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const RADIAN = Math.PI / 180;
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            fill="#fff"
                                            textAnchor={x > cx ? 'start' : 'end'}
                                            dominantBaseline="central"
                                            fontSize={14}
                                        >
                                            {(percent * 100).toFixed(0)}%
                                        </text>
                                    );
                                }}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Subject;