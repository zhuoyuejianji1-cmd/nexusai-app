import json

# 读取课程数据
data_path = 'c:/Users/wenzai/Desktop/ai数据网/projects/src/app/premium/courses.json'
with open(data_path, encoding='utf-8') as f:
    data = json.load(f)

# 查找包含 "9.9" 的课程
print('包含 "9.9" 的课程:')
print('='*60)

count = 0
for course in data:
    content = course.get('content', '')
    if '9.9' in content:
        count += 1
        if count <= 5:  # 只显示前5个
            print(f'\n课程: {course["title"]}')
            # 显示包含9.9的上下文
            idx = content.find('9.9')
            start = max(0, idx - 50)
            end = min(len(content), idx + 50)
            print(f'上下文: ...{content[start:end]}...')

print(f'\n总共 {count} 个课程包含 "9.9"')
