import { useState, useEffect } from 'react';
import { Text } from 'ink';

const Counter = () => {
    const [counter, setCounter] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setCounter(previousCounter => {
                if (previousCounter >= 199) {
                    clearInterval(timer);
                    return 200;
                }
                return previousCounter + 1;
            });
        }, 100);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Text color="green">
            {counter < 200 ? `${counter} tests passed` : '200 tests done'}
        </Text>
    );
};

export default Counter;