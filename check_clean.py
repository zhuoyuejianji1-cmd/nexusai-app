import json

# 读取课程数据
data_path = 'c:/Users/wenzai/Desktop/ai数据网/projects/src/app/premium/courses.json'
with open(data_path, encoding='utf-8') as f:
    data = json.load(f)

print(f'总课程数: {len(data)}')

# 查看前3个课程的清理效果
for i in range(min(3, len(data))):
    course = data[i]
    print(f'\n{"="*60}')
    print(f'课程 {i+1}: {course["title"]}')
    print(f'{"="*60}')
    print(f'课程介绍内容:')
    print(course['content'][:500] if course['content'] else '(空)')
    print(f'...')
    print(f'\n描述: {course["description"][:100]}...')

# 检查是否还有不该出现的内容
print(f'\n{"="*60}')
print('检查是否还有不该出现的内容:')
print(f'{"="*60}')

keywords_to_check = ['悠悠云学社', '4天前发布', '资源下载', '课程下载', 'pan.baidu.com', '9.9']
for keyword in keywords_to_check:
    count = sum(1 for c in data if keyword in c.get('content', ''))
    if count > 0:
        print(f'⚠️  "{keyword}" 还出现在 {count} 个课程中')
    else:
        print(f'✅ "{keyword}" 已全部清理')
