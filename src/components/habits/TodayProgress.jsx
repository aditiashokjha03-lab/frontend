import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

const TodayProgress = ({ completed, total }) => {
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    const data = [{ name: 'Progress', value: percentage, fill: 'hsl(var(--primary))' }];

    let message = "Let's get started!";
    if (percentage === 100) message = "Perfect day! 🎉";
    else if (percentage >= 50) message = "You're over halfway there!";
    else if (percentage > 0) message = "Good progress, keep going!";

    return (
        <Card className="flex flex-col items-center justify-center p-6 text-center shadow-md">
            <CardContent className="p-0">
                <div className="relative w-40 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            cx="50%" cy="50%"
                            innerRadius="70%" outerRadius="100%"
                            barSize={15}
                            data={data}
                            startAngle={90} endAngle={-270}
                        >
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold">{completed}/{total}</span>
                    </div>
                </div>
                <h3 className="mt-4 font-semibold text-lg">{message}</h3>
                <p className="text-sm text-muted-foreground mt-1">{percentage}% completed today</p>
            </CardContent>
        </Card>
    );
};

export default TodayProgress;
