<template>
    <div class="contact-list">
        <el-scrollbar>
            <el-collapse v-model="activeGroups" accordion>
                <el-collapse-item v-for="group in groupedContacts" :key="group.name" :name="group.name" :title="`${group.name} (${group.contacts.length})`">
                    <div v-for="contact in group.contacts" :key="contact.id" class="contact-item" :class="{ active: contact.id === activeContact?.id }" @click="$emit('select', contact)">
                        <el-avatar :size="40" :src="contact.avatar" />
                        <div class="contact-info">
                            <div class="name">{{ contact.name }}</div>
                            <div class="last-message">{{ contact.lastMessage }}</div>
                        </div>
                        <div class="contact-meta">
                            <div class="time">{{ contact.lastTime }}</div>
                            <el-badge v-if="contact.unread > 0" :value="contact.unread" class="badge" />
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-scrollbar>
    </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
    props: {
        contacts: {
            type: Array,
            required: true
        },
        activeContact: {
            type: Object,
            default: null
        }
    },
    setup(props) {
        const activeGroups = ref(['好友']) // 默认展开好友分组
    
        // 按分组组织联系人
        const groupedContacts = computed(() => {
            const groups = {}
            props.contacts.forEach(contact => {
                if (!groups[contact.group]) {
                    groups[contact.group] = []
                }
                groups[contact.group].push(contact)
            })
      
            return Object.keys(groups).map(name => ({
                name,
                contacts: groups[name]
            }))
        })
    
        return {
            activeGroups,
            groupedContacts
        }
  }
}
</script>

<style scoped>
.contact-list {
    flex: 1;
    overflow: hidden;
}

.contact-item {
    display: flex;
    padding: 12px;
    cursor: pointer;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
}

.contact-item:hover {
    background-color: #f5f5f5;
}

.contact-item.active {
    background-color: #e6e6e6;
}

.contact-info {
    flex: 1;
    margin-left: 12px;
    overflow: hidden;
}

.contact-info .name {
    font-size: 14px;
    color: #333;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.contact-info .last-message {
    font-size: 12px;
    color: #999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.contact-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-left: 12px;
}

.contact-meta .time {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
}

:deep(.el-collapse-item__header) {
    padding-left: 20px;
    font-weight: bold;
    border-bottom: none;
}

:deep(.el-collapse-item__content) {
    padding-bottom: 0;
}
</style>