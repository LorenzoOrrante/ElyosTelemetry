import ReactSpeedometer from "react-d3-speedometer";

const Speedometer = ({ speed = 0, maxValue = 80 }) => {
    return (
        <ReactSpeedometer 
            value={speed}
            maxValue={maxValue}
            segments={5}
            needleColor="white"
            startColor="#374151"
            endColor="#dc2626"
            textColor="white"
            ringWidth={30}
            height={200}
            width={300}
            currentValueText={`${speed} km/h`}

        />
    );
}

export default Speedometer;