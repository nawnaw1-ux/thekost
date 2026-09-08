import { LineChartComponent } from "./LineChart";
import MonthRangeOkupansi from "./MonthRangeOkupansi";

interface Props {
    residentData: any;
    groupedResidentYear: {
        year: string;
    }[];
}
const OkupansiResident = ({ residentData, groupedResidentYear }: Props) => {
    return (
        <>
            <p className="text-base font-semibold">OKUPANSI PENGHUNI</p>
            <hr className="my-6 border w-[90%] h-px border-foreground/5" />{" "}
            <div className="flex w-full mb-3 justify-center">
                <MonthRangeOkupansi groupedResidentYear={groupedResidentYear} />
            </div>
            <LineChartComponent residentData={residentData} />
        </>
    );
};

export default OkupansiResident;
