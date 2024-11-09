### 8 directional animated sprite using threejs.

https://github.com/user-attachments/assets/84899c32-0c92-495a-a1cc-679f7b8e85a9

- UV data exported from crocotile3D
```json
{
    "name": "sprite_walk_N",
    "uuid": "287F07C9-F4E1-4F90-B8E9-083DA0CF8B79",
    "tileset": 1,
    "frame": [
      {
        "uv": [
          { "x": 0.0078125, "y": 0.17013888888888906 },
          { "x": 0.0078125, "y": 0.22916666666666674 },
          { "x": 0.109375, "y": 0.22916666666666674 },
          { "x": 0.109375, "y": 0.17013888888888906 }
        ],
        "duration": 0.2
      },
      {
        "uv": [
          { "x": 0.0078125, "y": 0.09027777777777801 },
          { "x": 0.0078125, "y": 0.14930555555555558 },
          { "x": 0.109375, "y": 0.14930555555555558 },
          { "x": 0.109375, "y": 0.09027777777777801 }
        ],
        "duration": 0.2
      },
      {
        "uv": [
          { "x": 0.0078125, "y": 0.003472222222222654 },
          { "x": 0.0078125, "y": 0.06250000000000022 },
          { "x": 0.109375, "y": 0.06250000000000022 },
          { "x": 0.109375, "y": 0.003472222222222654 }
        ],
        "duration": 0.2
      }
    ],
    "canvasWidth": 128,
    "canvasHeight": 288
  }
```
- each animation includes an direction suffix
- each object in the frame array includes the UV coordinates for the texture
- map each vertex of the plane to texture UV data
``` typescript
   // ThreeJS creates the vertexes for a plane in the order of top left > top right > bottom right > bottom left
  if (currentFrameUVs) {
    animatedSpriteMesh.geometry.attributes.uv.setXY(
      0,
      currentFrameUVs[1].x,
      currentFrameUVs[1].y,
    );
    animatedSpriteMesh.geometry.attributes.uv.setXY(
      1,
      currentFrameUVs[2].x,
      currentFrameUVs[2].y,
    );
    animatedSpriteMesh.geometry.attributes.uv.setXY(
      2,
      currentFrameUVs[0].x,
      currentFrameUVs[0].y,
    );
    animatedSpriteMesh.geometry.attributes.uv.setXY(
      3,
      currentFrameUVs[3].x,
      currentFrameUVs[3].y,
    );
    animatedSpriteMesh.geometry.attributes.uv.needsUpdate = true;
  }
```
- direction is updated based on `currentDirection = getDirection(controls.getAzimuthalAngle());`
