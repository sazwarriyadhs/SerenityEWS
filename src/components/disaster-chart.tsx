"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';

export interface DisasterChartProps {
  data: {
    category: string;
    count: number;
  }[];
}

export function DisasterChart({ data }: DisasterChartProps) {
    const { t } = useLanguage();
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('disaster_report.chart_title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
            <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} interval={0} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                        contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)"
                        }}
                    />
                    <Legend formatter={() => t('disaster_report.incident_count')} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
        ) : (
            <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                <p>{t('disaster_report.no_data_for_chart')}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
