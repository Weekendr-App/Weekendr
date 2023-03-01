import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

interface Point {
  lat: number;
  lng: number;
}

export class Bounds {
  constructor(public readonly _sw: Point, public readonly _ne: Point) {}
}

@Scalar('Bounds', () => Bounds)
export class BoundsScalar implements CustomScalar<string, Bounds> {
  parseValue(value: string): Bounds {
    const { _ne, _sw } = JSON.parse(value);

    return new Bounds(_sw, _ne);
  }

  serialize(value: Bounds): string {
    const { _sw, _ne } = value;
    return JSON.stringify({ _sw, _ne });
  }

  parseLiteral(ast: ValueNode): Bounds {
    if (ast.kind === Kind.STRING) {
      return this.parseValue(ast.value);
    }

    return null;
  }
}
