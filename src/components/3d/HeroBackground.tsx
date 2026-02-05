
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

function Stars(props: any) {
    const ref = useRef<any>();

    // Create random points in a sphere - size must be multiple of 3 (x,y,z)
    const sphere = useMemo(() => {
        const data = random.inSphere(new Float32Array(5001), { radius: 1.5 }) as Float32Array;
        // Ensure no NaN values reach the geometry
        for (let i = 0; i < data.length; i++) {
            if (isNaN(data[i])) data[i] = 0;
        }
        return data;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#0EA5E9" // Sky blue from your theme
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

function Grid() {
    return (
        <gridHelper args={[20, 20, 0x0EA5E9, 0x222222]} position={[0, -1, 0]} />
    )
}

export const HeroBackground = () => {
    return (
        <div className="absolute inset-0 -z-10 bg-slate-950/20">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Stars />
                {/* <Grid /> Optional: Add a grid for more tech feel */}
            </Canvas>
        </div>
    );
};
