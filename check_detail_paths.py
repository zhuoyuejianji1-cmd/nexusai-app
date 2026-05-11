import json

# 读取课程数据
data_path = 'c:/Users/wenzai/Desktop/ai数据网/projects/src/app/premium/courses.json'
with open(data_path, encoding='utf-8') as f:
    data = json.load(f)

# 找几个有详情图片的课程
courses_with_images = [c for c in data if c.get('detailImages') and len(c['detailImages']) > 0]

print(f'有详情图的课程: {len(courses_with_images)}/{len(data)}')

if courses_with_images:
    print('\n检查详情图片路径:')
    print('='*60)
    for i in range(min(3, len(courses_with_images))):
        course = courses_with_images[i]
        print(f'\n课程: {course["title"]}')
        print(f'  详情图片数量: {len(course["detailImages"])}')
        print(f'  详情图片路径:')
        for j, img in enumerate(course['detailImages'][:3]):
            print(f'    [{j}] {img}')
